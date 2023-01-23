class AutomateAPI {

  at: AutomationType;
  constructor(automationType: AutomationType) {
    this.at = automationType;
  }
}

class APIAutomationResult {
  name: string;
  value: string;
}

enum AutomationType {
  PUBLIC,
  PRIVATE
}
