/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const config = require("./config.json");

module.exports = (app) => {
  app.log.info("Loaded!");

  app.on("issues.opened", async (context) => {
    app.log.info("New issue. Posting first comment!");
    const issueComment = context.issue({
      body: config.messages.welcome,
    });
    return context.octokit.issues.createComment(issueComment);
  });

  app.on("issues.opened", async (context) => {
    app.log.info("New issue. Adding labels!");
    const newLabels = context.issue({
      labels:[
        config.labels.new,
        config.labels.waitingOnYou
      ]
    });
    return context.octokit.issues.addLabels(newLabels);
  });

  app.on("issue_comment.created", async (context) => {
    if (context.isBot) return; // ignore the bots
    app.log.info("New comment. Deciding which labels to apply!")
    let waitingOn;
    if (context.payload.comment.author_association === "OWNER") {
      waitingOn = context.issue({
        labels:[config.labels.waitingOnUser],
      });
    } else {
      waitingOn = context.issue({
        labels:[config.labels.waitingOnYou],
      })
    }
    // completely overwrite labels for now...
    return context.octokit.issues.setLabels(waitingOn);
  });
};
