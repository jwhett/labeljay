const pickLabels = (config, context, issueLabels) => {
  let waitingOn;
  let toBeRemoved;
  let removeNew;
  if (context.payload.comment.author_association === "OWNER") {
    waitingOn = config.labels.waitingOnUser;
    toBeRemoved = config.labels.waitingOnYou;
    removeNew = true;
  } else {
    waitingOn = config.labels.waitingOnYou;
    toBeRemoved = config.labels.waitingOnUser;
  }

  // remove the old label if it exists
  if (issueLabels.includes(toBeRemoved)) {
    delete issueLabels[issueLabels.indexOf(toBeRemoved)];
  }

  // make sure we remove the "new" label when it's
  // no longer needed.
  if (removeNew && issueLabels.includes(config.labels.new)) {
    delete issueLabels[issueLabels.indexOf(config.labels.new)];
  }

  // add the new label
  issueLabels.push(waitingOn);

  // clean the array
  newLabels = issueLabels.filter((label) => {
    return label !== null;
  });

  return newLabels;
};

module.exports = { pickLabels };
