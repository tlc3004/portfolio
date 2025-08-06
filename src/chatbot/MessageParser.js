class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lower = message.toLowerCase();

    if (lower.includes("hola")) {
      this.actionProvider.handleHello();
    } else {
      this.actionProvider.handleUnknown();
    }
  }
}

export default MessageParser;
