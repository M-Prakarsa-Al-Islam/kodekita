// The Python-side "run a small project" harness used by lib/pyodide.ts.
// Kept in its own file (no browser APIs) so scripts/test-runner.mjs can run
// this exact code in the real Pyodide from Node.
//
// What it does for every run (this is the point of the file):
//  1. CLEAN SLATE. Pyodide keeps its virtual disk between runs, so we delete
//     the working folder and rewrite every file from scratch: a file the
//     learner's code wrote or edited in one run is not there in the next, and
//     seed files (e.g. catatan.txt) are always in their original state.
//  2. FORGET OLD MODULES. Python caches imported modules for the life of the
//     page; without this, editing fungsi.py and pressing Run again would still
//     use the old version. (Also drops the cached directory listing of the
//     work folder; ~200 ms per run were saved by not using
//     importlib.invalidate_caches(), see the comment in the Python code.)
//  3. Runs the entry file as __main__ so `from fungsi import x` works,
//     tracebacks name the right file, and __name__ == "__main__" is true.
//  4. input(): replaced for the duration of the run by a function that reads
//     the scripted lines and prints exactly what a terminal would show (the
//     prompt, then the typed text and a newline). Running out of lines raises
//     EOFError like a closed stdin does.
//  5. Restores everything (cwd, sys.path, input) afterwards, even on error.
//
// IMPORTANT when editing: this is String.raw, so Python backslashes are kept
// as written; never put a backtick or ${ in the Python code.
export const PYTHON_HARNESS = String.raw`
import sys, io, os, json, shutil, builtins, traceback, contextlib

_PYMULA_WORK = "/home/pyodide/__pymula_work__"


sys.dont_write_bytecode = True  # no stale/extra .pyc files in the work folder


def _pymula_forget_modules():
    for _name, _mod in list(sys.modules.items()):
        _file = getattr(_mod, "__file__", None)
        if isinstance(_file, str) and _file.startswith(_PYMULA_WORK):
            del sys.modules[_name]
    # Forget the import system's cached directory listing of the work folder
    # (it is deleted and recreated every run). Do NOT call
    # importlib.invalidate_caches() here: in Pyodide it costs ~120 ms per call.
    sys.path_importer_cache.pop(_PYMULA_WORK, None)


def __pymula_run__(files_json, entry, stdin_json, show_location):
    files = json.loads(files_json)
    stdin_lines = [str(x) for x in json.loads(stdin_json)]
    out = io.StringIO()
    error = None

    if entry not in files:
        return ("", "File utama " + str(entry) + " tidak ditemukan.")
    for name in files:
        if name in ("", ".", "..") or os.path.basename(name) != name:
            return ("", "Nama file tidak valid: " + str(name))

    # 1. clean slate
    shutil.rmtree(_PYMULA_WORK, ignore_errors=True)
    os.makedirs(_PYMULA_WORK)
    for name, content in files.items():
        with open(os.path.join(_PYMULA_WORK, name), "w", encoding="utf-8", newline="") as f:
            f.write(content)
    # 2. forget modules of any earlier run
    _pymula_forget_modules()

    previous_cwd = os.getcwd()
    real_input = builtins.input

    def fake_input(prompt=""):
        sys.stdout.write(str(prompt))
        if not stdin_lines:
            raise EOFError("EOF when reading a line")
        line = stdin_lines.pop(0)
        sys.stdout.write(line + "\n")
        return line

    def describe(e):
        text = type(e).__name__ + ": " + str(e)
        text = text.replace(_PYMULA_WORK + "/", "")
        if not show_location or isinstance(e, SyntaxError):
            return text  # a SyntaxError message already names file and line
        where = None
        for frame in reversed(traceback.extract_tb(e.__traceback__)):
            base = os.path.basename(frame.filename)
            if base in files:
                where = base + ", baris " + str(frame.lineno)
                break
        return text + (" (" + where + ")" if where else "")

    os.chdir(_PYMULA_WORK)
    sys.path.insert(0, _PYMULA_WORK)
    builtins.input = fake_input
    try:
        with contextlib.redirect_stdout(out):
            code = compile(files[entry], entry, "exec")
            exec(code, {"__name__": "__main__", "__file__": entry})
    except SystemExit:
        pass
    except Exception as e:
        error = describe(e)
    finally:
        builtins.input = real_input
        try:
            sys.path.remove(_PYMULA_WORK)
        except ValueError:
            pass
        os.chdir(previous_cwd)
        shutil.rmtree(_PYMULA_WORK, ignore_errors=True)
        _pymula_forget_modules()

    return (out.getvalue(), error)
`;
