class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleHello() {
    const msg = this.createChatBotMessage("¡Hola! 👋");
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, msg] }));
  }

  handleUnknown() {
    const msg = this.createChatBotMessage("No entendí eso... ¿Puedes reformular?");
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, msg] }));
  }
}

export default ActionProvider;
