// enforce-foo-bar.js

module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "对象内部注释对齐"
    },
    fixable: "code",
    schema: [],
    hasSuggestions: true
  },
  create(context) {
    console.log('create')
    let workedComments = []
    
    function isWorkedComment(comment){
      return workedComments.filter(item => {
        return item.loc.start.line === comment.loc.start.line && item.loc.start.column === comment.loc.start.column
      }).length > 0
    }

    return {
      "ObjectExpression:exit"(node){
        console.log('ObjectExpression:exit')
        let maxColumnInside = 0;
        let tokens = context.getSourceCode().getTokens(node);
        let commas = tokens.filter(item => item.value === ',');
        let comments = commas.map(comma => {
          let commentsVal = context.getSourceCode().getCommentsAfter(comma).filter(comment => {
            if(isWorkedComment(comment)) {
              return false
            }
            workedComments.push(comment)
            return comment.loc.start.line === comma.loc.start.line
          })[0]
          if(commentsVal) {
            let column = commentsVal.loc.start.column
            if(column > maxColumnInside) {
              maxColumnInside = column
            }
          }
          return commentsVal
        }).filter(item => !!item)

        if(Array.from(new Set(comments)).length > 0) {
          comments.forEach(comment => {
            let comma = context.getSourceCode().getTokenBefore(comment);
            if(comment.loc.start.column === maxColumnInside) {
              return
            }
            context.report({
              // node: comment,
              loc: {
                start: {
                  line: comma.loc.end.line,
                  column: comma.loc.end.column
                },
                end: {
                  line: comment.loc.start.line,
                  column: comment.loc.start.column
                }
              },
              message: '注释间隔没对齐哦',
              data: {
                maxColumnInside
              },
              fix(fixer) {
                let needSpacing = maxColumnInside - comment.loc.start.column;
                return fixer.insertTextBefore(comment, ' '.repeat(needSpacing))
              }
            })
            
          })
        }
      }
    };
  }
};