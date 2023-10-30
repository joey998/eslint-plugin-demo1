// enforce-foo-bar.js

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Enforce that a variable named `foo` can only be assigned a value of 'bar'."
        },
        fixable: "code",
        schema: [],
        hasSuggestions: true
    },
    create(context) {
        console.log('create')
        let workedComments = []

        function isWorkedComment(comment) {
            return workedComments.filter(item => {
                return item.loc.start.line === comment.loc.start.line && item.loc.start.column === comment.loc.start.column
            }).length > 0
        }
        return {

            // Performs action in the function on every variable declarator
            VariableDeclarator(node) {

                // Check if a `const` variable declaration
                if (node.parent.kind === "const") {

                    // Check if variable name is `foo`
                    if (node.id.type === "Identifier" && node.id.name === "foo") {

                        // Check if value of variable is "bar"
                        if (node.init && node.init.type === "Literal" && node.init.value !== "bar") {

                            /*
                             * Report error to ESLint. Error message uses
                             * a message placeholder to include the incorrect value
                             * in the error message.
                             * Also includes a `fix(fixer)` function that replaces
                             * any values assigned to `const foo` with "bar".
                             */
                            context.report({
                                node,
                                message: 'Value other than "bar" assigned to `const foo`. Unexpected value: {{ notBar }}.',
                                data: {
                                    notBar: node.init.value,
                                    identifier: node.name
                                },
                                fix(fixer) {
                                    return fixer.replaceText(node.init, '"bar"');
                                },
                                // suggest: [
                                //   {
                                //     desc: "Remove the `\\`. This maintains the current functionality.",
                                //     fix: function (fixer) {
                                //       return fixer.replaceText(node.init, '"ba1r"');
                                //     }
                                //   },
                                //   {
                                //     desc: "Replace the `\\` with `\\\\` to include the actual backslash character.",
                                //     fix: function (fixer) {
                                //       return fixer.replaceText(node.init, '"bar"');
                                //     }
                                //   }
                                // ]
                            });
                        }
                    }
                }
            }
        };
    }
};