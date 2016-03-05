﻿export const themes = [
    ["Chrome"],
    ["Clouds"],
    ["Crimson Editor"],
    ["Dawn"],
    ["Dreamweaver"],
    ["Eclipse"],
    ["GitHub"],
    ["IPlastic"],
    ["Solarized Light"],
    ["TextMate"],
    ["Tomorrow"],
    ["XCode"],
    ["Kuroir"],
    ["KatzenMilch"],
    ["SQL Server", "sqlserver"],
    ["Ambiance"],
    ["Chaos"],
    ["Clouds Midnight"],
    ["Cobalt"],
    ["idle Fingers"],
    ["krTheme", "kr_theme"],
    ["Merbivore"],
    ["Merbivore Soft"],
    ["Mono Industrial"],
    ["Monokai", "monokai"],
    ["Pastel on dark"],
    ["Solarized Dark"],
    ["Terminal", "terminal"],
    ["Tomorrow Night"],
    ["Tomorrow Night Blue"],
    ["Tomorrow Night Bright"],
    ["Tomorrow Night 80s", "tomorrow_night_eighties"],
    ["Twilight"],
    ["Vibrant Ink"]
];

export const getThemeFile = (theme) => {
    theme = themes[theme] === undefined ? 6 : theme;

    // Return set theme file or convert name to file
    return "ace/theme/" + (
        (themes[theme][1] !== undefined)
        ? themes[theme][1]
        : themes[theme][0].toLowerCase().split(' ').join('_')
    );
};

export const syntaxes = [
    ["ABAP"],
    ["ABC"],
    ["ActionScript"],
    ["ADA"],
    ["Apache_Conf"],
    ["AsciiDoc"],
    ["Assembly_x86"],
    ["AutoHotKey"],
    ["BatchFile"],
    ["C and C++", "c_cpp"],
    ["C9Search"],
    ["Cirru"],
    ["Clojure"],
    ["Cobol"],
    ["CoffeeScript", "coffee"],
    ["ColdFusion"],
    ["C#", "CSharp"],
    ["CSS"],
    ["Curly"],
    ["D"],
    ["Dart"],
    ["Diff"],
    ["Dockerfile"],
    ["Dot"],
    ["Dummy"],
    ["DummySyntax"],
    ["Eiffel"],
    ["EJS"],
    ["Elixir"],
    ["Elm"],
    ["Erlang"],
    ["Forth"],
    ["FreeMarker", "ftl"],
    ["Gcode"],
    ["Gherkin"],
    ["Gitignore"],
    ["Glsl"],
    ["Gobstones"],
    ["Go", "golang"],
    ["Groovy"],
    ["HAML"],
    ["Handlebars"],
    ["Haskell"],
    ["haXe"],
    ["HTML"],
    ["HTML (Elixir)", "html_elixir"],
    ["HTML (Ruby)", "html_ruby"],
    ["INI"],
    ["Io"],
    ["Jack"],
    ["Jade"],
    ["Java"],
    ["JavaScript"],
    ["JSON"],
    ["JSONiq"],
    ["JSP"],
    ["JSX"],
    ["Julia"],
    ["LaTeX"],
    ["Lean"],
    ["LESS"],
    ["Liquid"],
    ["Lisp"],
    ["LiveScript"],
    ["LogiQL"],
    ["LSL"],
    ["Lua"],
    ["LuaPage"],
    ["Lucene"],
    ["Makefile"],
    ["Markdown"],
    ["Mask"],
    ["MATLAB"],
    ["Maze"],
    ["MEL"],
    ["MUSHCode"],
    ["MySQL"],
    ["Nix"],
    ["NSIS"],
    ["Objective-C", "objectivec"],
    ["OCaml"],
    ["Pascal"],
    ["Perl"],
    ["pgSQL"],
    ["PHP"],
    ["Powershell"],
    ["Praat"],
    ["Prolog"],
    ["Properties"],
    ["Protobuf"],
    ["Python"],
    ["R"],
    ["Razor"],
    ["RDoc"],
    ["RHTML"],
    ["RST"],
    ["Ruby"],
    ["Rust"],
    ["SASS"],
    ["SCAD"],
    ["Scala"],
    ["Scheme"],
    ["SCSS"],
    ["SH"],
    ["SJS"],
    ["Smarty"],
    ["snippets"],
    ["Soy_Template"],
    ["Space"],
    ["SQL"],
    ["SQLServer"],
    ["Stylus"],
    ["SVG"],
    ["Swift"],
    ["Tcl"],
    ["Tex"],
    ["Text"],
    ["Textile"],
    ["Toml"],
    ["Twig"],
    ["Typescript"],
    ["Vala"],
    ["VBScript"],
    ["Velocity"],
    ["Verilog"],
    ["VHDL"],
    ["Wollok"],
    ["XML"],
    ["XQuery"],
    ["YAML"],
    ["Django"]
];

export const getSyntaxFile = (syntax) => {
    syntax = syntaxes[syntax] === undefined ? 70 : syntax;

    // Return set mode file or convert name to file
    return "ace/mode/" + (
        (syntaxes[syntax][1] !== undefined)
        ? syntaxes[syntax][1]
        : syntaxes[syntax][0].toLowerCase()
    );
};