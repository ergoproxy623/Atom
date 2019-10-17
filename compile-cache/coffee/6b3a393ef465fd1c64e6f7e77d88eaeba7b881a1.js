(function() {
  var meta;

  meta = {
    define: "https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey",
    key: (function() {
      switch (process.platform) {
        case "darwin":
          return "⌘";
        case "linux":
          return "Super";
        case "win32":
          return "❖";
      }
    })()
  };

  module.exports = {
    general: {
      order: 1,
      type: "object",
      properties: {
        gitPath: {
          order: 1,
          title: "Git Path",
          type: "string",
          "default": "git",
          description: "If git is not in your PATH, specify where the executable is"
        },
        enableStatusBarIcon: {
          order: 2,
          title: "Status-bar Icon",
          type: "boolean",
          "default": true,
          description: "The 'git+' icon in the bottom-right of the status-bar toggles the output view above the status-bar"
        },
        openInPane: {
          order: 3,
          title: "Allow commands to open new panes",
          type: "boolean",
          "default": true,
          description: "Commands like `Commit`, `Log`, `Show`, `Diff` can be split into new panes"
        },
        splitPane: {
          order: 4,
          title: "Split pane direction",
          type: "string",
          "default": "Down",
          description: "Where should new panes go?",
          "enum": ["Up", "Right", "Down", "Left"]
        },
        showFormat: {
          order: 5,
          title: "Format option for 'Git Show'",
          type: "string",
          "default": "full",
          "enum": ["oneline", "short", "medium", "full", "fuller", "email", "raw", "none"],
          description: "Which format to use for `git show`? (`none` will use your git config default)"
        },
        alwaysOpenDockWithResult: {
          order: 6,
          title: "Always show result output",
          type: "boolean",
          "default": false,
          description: "Always display the output view after a command completes (regardless of dock visibility). If the view has been destroyed, it will need to be manually toggled."
        },
        newBranchKey: {
          order: 7,
          title: "Status-bar New Branch modifier key",
          type: "string",
          "default": "alt",
          description: "Holding this modifier key while clicking on the branch name in the status bar will trigger creating a new branch. Note that _[`meta`](" + meta.define + ")_ is <kbd>" + meta.key + "</kbd>",
          "enum": ["alt", "shift", "meta", "ctrl"]
        },
        showBranchInTreeView: {
          order: 8,
          title: "Show current branch name in tree view.",
          type: "boolean",
          "default": true,
          description: "The branch name will be displayed next to repo root in the tree view as `[branch-name]`."
        }
      }
    },
    commits: {
      order: 2,
      type: "object",
      properties: {
        verboseCommits: {
          title: "Verbose Commits",
          description: "Show diffs in commit pane?",
          type: "boolean",
          "default": false
        }
      }
    },
    diffs: {
      order: 3,
      type: "object",
      properties: {
        includeStagedDiff: {
          order: 1,
          title: "Include staged diffs?",
          type: "boolean",
          "default": true
        },
        wordDiff: {
          order: 2,
          title: "Word diff",
          type: "boolean",
          "default": false,
          description: "Should diffs be generated with the `--word-diff` flag?"
        },
        syntaxHighlighting: {
          order: 3,
          title: "Enable syntax highlighting in diffs?",
          type: "boolean",
          "default": true
        },
        useSplitDiff: {
          order: 4,
          title: "Split diff",
          type: "boolean",
          "default": false,
          description: "Use the split-diff package to show diffs for a single file. Only works with `Diff` command when a file is open."
        }
      }
    },
    logs: {
      order: 4,
      type: "object",
      properties: {
        numberOfCommitsToShow: {
          order: 1,
          title: "Number of commits to load",
          type: "integer",
          "default": 25,
          minimum: 1,
          description: "Initial amount of commits to load when running the `Log` command"
        }
      }
    },
    remoteInteractions: {
      order: 5,
      type: "object",
      properties: {
        pullRebase: {
          order: 1,
          title: "Pull Rebase",
          type: "boolean",
          "default": false,
          description: "Pull with `--rebase` flag?"
        },
        pullAutostash: {
          order: 2,
          title: "Pull AutoStash",
          type: "boolean",
          "default": false,
          description: "Pull with `--autostash` flag?"
        },
        pullBeforePush: {
          order: 3,
          title: "Pull Before Pushing",
          type: "boolean",
          "default": false,
          description: "Pull from remote before pushing"
        },
        promptForBranch: {
          order: 4,
          title: "Prompt for branch selection when pulling/pushing",
          type: "boolean",
          "default": false,
          description: "If false, it defaults to current branch upstream"
        }
      }
    },
    tags: {
      order: 6,
      type: "object",
      properties: {
        signTags: {
          title: "Sign git tags with GPG",
          type: "boolean",
          "default": false,
          description: "Use a GPG key to sign Git tags"
        }
      }
    },
    experimental: {
      order: 7,
      type: "object",
      properties: {
        customCommands: {
          order: 1,
          title: "Custom Commands",
          type: "boolean",
          "default": false,
          description: "Declared custom commands in your `init` file that can be run from the Git-plus command palette"
        },
        diffBranches: {
          order: 2,
          title: "Show diffs across branches",
          type: "boolean",
          "default": false,
          description: "Diffs will be shown for the current branch against a branch you choose. The `Diff branch files` command will allow choosing which file to compare. The file feature requires the 'split-diff' package to be installed."
        },
        autoFetch: {
          order: 3,
          title: "Auto-fetch",
          type: "integer",
          "default": 0,
          maximum: 60,
          description: "Automatically fetch remote repositories every `x` minutes (`0` will disable this feature)"
        },
        autoFetchNotify: {
          order: 4,
          title: "Auto-fetch notification",
          type: "boolean",
          "default": false,
          description: "Show notifications while running `fetch --all`?"
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL2NvbmZpZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FDRTtJQUFBLE1BQUEsRUFBUSxxRUFBUjtJQUNBLEdBQUE7QUFDRSxjQUFPLE9BQU8sQ0FBQyxRQUFmO0FBQUEsYUFDTyxRQURQO2lCQUNxQjtBQURyQixhQUVPLE9BRlA7aUJBRW9CO0FBRnBCLGFBR08sT0FIUDtpQkFHb0I7QUFIcEI7UUFGRjs7O0VBT0YsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE9BQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxDQUFQO01BQ0EsSUFBQSxFQUFNLFFBRE47TUFFQSxVQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxVQURQO1VBRUEsSUFBQSxFQUFNLFFBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7VUFJQSxXQUFBLEVBQWEsNkRBSmI7U0FERjtRQU1BLG1CQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxpQkFEUDtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1VBSUEsV0FBQSxFQUFhLG9HQUpiO1NBUEY7UUFZQSxVQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxrQ0FEUDtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1VBSUEsV0FBQSxFQUFhLDJFQUpiO1NBYkY7UUFrQkEsU0FBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLENBQVA7VUFDQSxLQUFBLEVBQU8sc0JBRFA7VUFFQSxJQUFBLEVBQU0sUUFGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFIVDtVQUlB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REY7T0FIRjtLQWxJRjtJQTBJQSxZQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sQ0FBUDtNQUNBLElBQUEsRUFBTSxRQUROO01BRUEsVUFBQSxFQUNFO1FBQUEsY0FBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLENBQVA7VUFDQSxLQUFBLEVBQU8saUJBRFA7VUFFQSxJQUFBLEVBQU0sU0FGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtVQUlBLFdBQUEsRUFBYSxnR0FKYjtTQURGO1FBTUEsWUFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLENBQVA7VUFDQSxLQUFBLEVBQU8sNEJBRFA7VUFFQSxJQUFBLEVBQU0sU0FGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtVQUlBLFdBQUEsRUFBYSx3TkFKYjtTQVBGO1FBWUEsU0FBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLENBQVA7VUFDQSxLQUFBLEVBQU8sWUFEUDtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUhUO1VBSUEsT0FBQSxFQUFTLEVBSlQ7VUFLQSxXQUFBLEVBQWEsMkZBTGI7U0FiRjtRQW1CQSxlQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyx5QkFEUDtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1VBSUEsV0FBQSxFQUFhLGlEQUpiO1NBcEJGO09BSEY7S0EzSUY7O0FBVEYiLCJzb3VyY2VzQ29udGVudCI6WyJtZXRhID0gI0tleVxuICBkZWZpbmU6IFwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL01vdXNlRXZlbnQvbWV0YUtleVwiXG4gIGtleTpcbiAgICBzd2l0Y2ggcHJvY2Vzcy5wbGF0Zm9ybVxuICAgICAgd2hlbiBcImRhcndpblwiIHRoZW4gXCLijJhcIlxuICAgICAgd2hlbiBcImxpbnV4XCIgdGhlbiBcIlN1cGVyXCJcbiAgICAgIHdoZW4gXCJ3aW4zMlwiIHRoZW4gXCLinZZcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGdlbmVyYWw6XG4gICAgb3JkZXI6IDFcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgcHJvcGVydGllczpcbiAgICAgIGdpdFBhdGg6XG4gICAgICAgIG9yZGVyOiAxXG4gICAgICAgIHRpdGxlOiBcIkdpdCBQYXRoXCJcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICBkZWZhdWx0OiBcImdpdFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIklmIGdpdCBpcyBub3QgaW4geW91ciBQQVRILCBzcGVjaWZ5IHdoZXJlIHRoZSBleGVjdXRhYmxlIGlzXCJcbiAgICAgIGVuYWJsZVN0YXR1c0Jhckljb246XG4gICAgICAgIG9yZGVyOiAyXG4gICAgICAgIHRpdGxlOiBcIlN0YXR1cy1iYXIgSWNvblwiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlICdnaXQrJyBpY29uIGluIHRoZSBib3R0b20tcmlnaHQgb2YgdGhlIHN0YXR1cy1iYXIgdG9nZ2xlcyB0aGUgb3V0cHV0IHZpZXcgYWJvdmUgdGhlIHN0YXR1cy1iYXJcIlxuICAgICAgb3BlbkluUGFuZTpcbiAgICAgICAgb3JkZXI6IDNcbiAgICAgICAgdGl0bGU6IFwiQWxsb3cgY29tbWFuZHMgdG8gb3BlbiBuZXcgcGFuZXNcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkNvbW1hbmRzIGxpa2UgYENvbW1pdGAsIGBMb2dgLCBgU2hvd2AsIGBEaWZmYCBjYW4gYmUgc3BsaXQgaW50byBuZXcgcGFuZXNcIlxuICAgICAgc3BsaXRQYW5lOlxuICAgICAgICBvcmRlcjogNFxuICAgICAgICB0aXRsZTogXCJTcGxpdCBwYW5lIGRpcmVjdGlvblwiXG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgZGVmYXVsdDogXCJEb3duXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiV2hlcmUgc2hvdWxkIG5ldyBwYW5lcyBnbz9cIlxuICAgICAgICBlbnVtOiBbXCJVcFwiLCBcIlJpZ2h0XCIsIFwiRG93blwiLCBcIkxlZnRcIl1cbiAgICAgIHNob3dGb3JtYXQ6XG4gICAgICAgIG9yZGVyOiA1XG4gICAgICAgIHRpdGxlOiBcIkZvcm1hdCBvcHRpb24gZm9yICdHaXQgU2hvdydcIlxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgIGRlZmF1bHQ6IFwiZnVsbFwiXG4gICAgICAgIGVudW06IFtcIm9uZWxpbmVcIiwgXCJzaG9ydFwiLCBcIm1lZGl1bVwiLCBcImZ1bGxcIiwgXCJmdWxsZXJcIiwgXCJlbWFpbFwiLCBcInJhd1wiLCBcIm5vbmVcIl1cbiAgICAgICAgZGVzY3JpcHRpb246IFwiV2hpY2ggZm9ybWF0IHRvIHVzZSBmb3IgYGdpdCBzaG93YD8gKGBub25lYCB3aWxsIHVzZSB5b3VyIGdpdCBjb25maWcgZGVmYXVsdClcIlxuICAgICAgYWx3YXlzT3BlbkRvY2tXaXRoUmVzdWx0OlxuICAgICAgICBvcmRlcjogNlxuICAgICAgICB0aXRsZTogXCJBbHdheXMgc2hvdyByZXN1bHQgb3V0cHV0XCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246IFwiQWx3YXlzIGRpc3BsYXkgdGhlIG91dHB1dCB2aWV3IGFmdGVyIGEgY29tbWFuZCBjb21wbGV0ZXMgKHJlZ2FyZGxlc3Mgb2YgZG9jayB2aXNpYmlsaXR5KS4gSWYgdGhlIHZpZXcgaGFzIGJlZW4gZGVzdHJveWVkLCBpdCB3aWxsIG5lZWQgdG8gYmUgbWFudWFsbHkgdG9nZ2xlZC5cIlxuICAgICAgbmV3QnJhbmNoS2V5OlxuICAgICAgICBvcmRlcjogN1xuICAgICAgICB0aXRsZTogXCJTdGF0dXMtYmFyIE5ldyBCcmFuY2ggbW9kaWZpZXIga2V5XCJcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICBkZWZhdWx0OiBcImFsdFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkhvbGRpbmcgdGhpcyBtb2RpZmllciBrZXkgd2hpbGUgY2xpY2tpbmcgb24gdGhlIGJyYW5jaCBuYW1lIGluIHRoZSBzdGF0dXMgYmFyIHdpbGwgdHJpZ2dlciBjcmVhdGluZyBhIG5ldyBicmFuY2guIE5vdGUgdGhhdCBfW2BtZXRhYF0oI3ttZXRhLmRlZmluZX0pXyBpcyA8a2JkPiN7bWV0YS5rZXl9PC9rYmQ+XCJcbiAgICAgICAgZW51bTogW1wiYWx0XCIsIFwic2hpZnRcIiwgXCJtZXRhXCIsIFwiY3RybFwiXVxuICAgICAgc2hvd0JyYW5jaEluVHJlZVZpZXc6XG4gICAgICAgIG9yZGVyOiA4XG4gICAgICAgIHRpdGxlOiBcIlNob3cgY3VycmVudCBicmFuY2ggbmFtZSBpbiB0cmVlIHZpZXcuXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYnJhbmNoIG5hbWUgd2lsbCBiZSBkaXNwbGF5ZWQgbmV4dCB0byByZXBvIHJvb3QgaW4gdGhlIHRyZWUgdmlldyBhcyBgW2JyYW5jaC1uYW1lXWAuXCJcbiAgY29tbWl0czpcbiAgICBvcmRlcjogMlxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgdmVyYm9zZUNvbW1pdHM6XG4gICAgICAgIHRpdGxlOiBcIlZlcmJvc2UgQ29tbWl0c1wiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlNob3cgZGlmZnMgaW4gY29tbWl0IHBhbmU/XCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgZGlmZnM6XG4gICAgb3JkZXI6IDNcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgcHJvcGVydGllczpcbiAgICAgIGluY2x1ZGVTdGFnZWREaWZmOlxuICAgICAgICBvcmRlcjogMVxuICAgICAgICB0aXRsZTogXCJJbmNsdWRlIHN0YWdlZCBkaWZmcz9cIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICB3b3JkRGlmZjpcbiAgICAgICAgb3JkZXI6IDJcbiAgICAgICAgdGl0bGU6IFwiV29yZCBkaWZmXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU2hvdWxkIGRpZmZzIGJlIGdlbmVyYXRlZCB3aXRoIHRoZSBgLS13b3JkLWRpZmZgIGZsYWc/XCJcbiAgICAgIHN5bnRheEhpZ2hsaWdodGluZzpcbiAgICAgICAgb3JkZXI6IDNcbiAgICAgICAgdGl0bGU6IFwiRW5hYmxlIHN5bnRheCBoaWdobGlnaHRpbmcgaW4gZGlmZnM/XCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgdXNlU3BsaXREaWZmOlxuICAgICAgICBvcmRlcjogNFxuICAgICAgICB0aXRsZTogXCJTcGxpdCBkaWZmXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246IFwiVXNlIHRoZSBzcGxpdC1kaWZmIHBhY2thZ2UgdG8gc2hvdyBkaWZmcyBmb3IgYSBzaW5nbGUgZmlsZS4gT25seSB3b3JrcyB3aXRoIGBEaWZmYCBjb21tYW5kIHdoZW4gYSBmaWxlIGlzIG9wZW4uXCJcbiAgbG9nczpcbiAgICBvcmRlcjogNFxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgbnVtYmVyT2ZDb21taXRzVG9TaG93OlxuICAgICAgICBvcmRlcjogMVxuICAgICAgICB0aXRsZTogXCJOdW1iZXIgb2YgY29tbWl0cyB0byBsb2FkXCJcbiAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgZGVmYXVsdDogMjVcbiAgICAgICAgbWluaW11bTogMVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJJbml0aWFsIGFtb3VudCBvZiBjb21taXRzIHRvIGxvYWQgd2hlbiBydW5uaW5nIHRoZSBgTG9nYCBjb21tYW5kXCJcbiAgcmVtb3RlSW50ZXJhY3Rpb25zOlxuICAgIG9yZGVyOiA1XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIHByb3BlcnRpZXM6XG4gICAgICBwdWxsUmViYXNlOlxuICAgICAgICBvcmRlcjogMVxuICAgICAgICB0aXRsZTogXCJQdWxsIFJlYmFzZVwiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlB1bGwgd2l0aCBgLS1yZWJhc2VgIGZsYWc/XCJcbiAgICAgIHB1bGxBdXRvc3Rhc2g6XG4gICAgICAgIG9yZGVyOiAyXG4gICAgICAgIHRpdGxlOiBcIlB1bGwgQXV0b1N0YXNoXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246IFwiUHVsbCB3aXRoIGAtLWF1dG9zdGFzaGAgZmxhZz9cIlxuICAgICAgcHVsbEJlZm9yZVB1c2g6XG4gICAgICAgIG9yZGVyOiAzXG4gICAgICAgIHRpdGxlOiBcIlB1bGwgQmVmb3JlIFB1c2hpbmdcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJQdWxsIGZyb20gcmVtb3RlIGJlZm9yZSBwdXNoaW5nXCJcbiAgICAgIHByb21wdEZvckJyYW5jaDpcbiAgICAgICAgb3JkZXI6IDRcbiAgICAgICAgdGl0bGU6IFwiUHJvbXB0IGZvciBicmFuY2ggc2VsZWN0aW9uIHdoZW4gcHVsbGluZy9wdXNoaW5nXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSWYgZmFsc2UsIGl0IGRlZmF1bHRzIHRvIGN1cnJlbnQgYnJhbmNoIHVwc3RyZWFtXCJcbiAgdGFnczpcbiAgICBvcmRlcjogNlxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgc2lnblRhZ3M6XG4gICAgICAgIHRpdGxlOiBcIlNpZ24gZ2l0IHRhZ3Mgd2l0aCBHUEdcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJVc2UgYSBHUEcga2V5IHRvIHNpZ24gR2l0IHRhZ3NcIlxuICBleHBlcmltZW50YWw6XG4gICAgb3JkZXI6IDdcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgcHJvcGVydGllczpcbiAgICAgIGN1c3RvbUNvbW1hbmRzOlxuICAgICAgICBvcmRlcjogMVxuICAgICAgICB0aXRsZTogXCJDdXN0b20gQ29tbWFuZHNcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJEZWNsYXJlZCBjdXN0b20gY29tbWFuZHMgaW4geW91ciBgaW5pdGAgZmlsZSB0aGF0IGNhbiBiZSBydW4gZnJvbSB0aGUgR2l0LXBsdXMgY29tbWFuZCBwYWxldHRlXCJcbiAgICAgIGRpZmZCcmFuY2hlczpcbiAgICAgICAgb3JkZXI6IDJcbiAgICAgICAgdGl0bGU6IFwiU2hvdyBkaWZmcyBhY3Jvc3MgYnJhbmNoZXNcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJEaWZmcyB3aWxsIGJlIHNob3duIGZvciB0aGUgY3VycmVudCBicmFuY2ggYWdhaW5zdCBhIGJyYW5jaCB5b3UgY2hvb3NlLiBUaGUgYERpZmYgYnJhbmNoIGZpbGVzYCBjb21tYW5kIHdpbGwgYWxsb3cgY2hvb3Npbmcgd2hpY2ggZmlsZSB0byBjb21wYXJlLiBUaGUgZmlsZSBmZWF0dXJlIHJlcXVpcmVzIHRoZSAnc3BsaXQtZGlmZicgcGFja2FnZSB0byBiZSBpbnN0YWxsZWQuXCJcbiAgICAgIGF1dG9GZXRjaDpcbiAgICAgICAgb3JkZXI6IDNcbiAgICAgICAgdGl0bGU6IFwiQXV0by1mZXRjaFwiXG4gICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgIGRlZmF1bHQ6IDBcbiAgICAgICAgbWF4aW11bTogNjBcbiAgICAgICAgZGVzY3JpcHRpb246IFwiQXV0b21hdGljYWxseSBmZXRjaCByZW1vdGUgcmVwb3NpdG9yaWVzIGV2ZXJ5IGB4YCBtaW51dGVzIChgMGAgd2lsbCBkaXNhYmxlIHRoaXMgZmVhdHVyZSlcIlxuICAgICAgYXV0b0ZldGNoTm90aWZ5OlxuICAgICAgICBvcmRlcjogNFxuICAgICAgICB0aXRsZTogXCJBdXRvLWZldGNoIG5vdGlmaWNhdGlvblwiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlNob3cgbm90aWZpY2F0aW9ucyB3aGlsZSBydW5uaW5nIGBmZXRjaCAtLWFsbGA/XCJcbiJdfQ==
