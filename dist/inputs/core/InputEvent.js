var EventType;
(function(EventType2) {
  EventType2["FOCUS"] = "focus";
  EventType2["BLUR"] = "blur";
  EventType2["UPDATE"] = "update";
  EventType2["UPDATE_DELAYED"] = "update-delayed";
  EventType2["UPDATE_START"] = "update-start";
  EventType2["UPDATE_END"] = "update-end";
})(EventType || (EventType = {}));
export class InputEvent extends CustomEvent {
  constructor(typeArg, value, isValid) {
    super(typeArg, {
      detail: {
        value,
        valid: isValid
      }
    });
  }
}
InputEvent.FOCUS = EventType.FOCUS;
InputEvent.BLUR = EventType.BLUR;
InputEvent.UPDATE = EventType.UPDATE;
InputEvent.UPDATE_STABLE = EventType.UPDATE_DELAYED;
InputEvent.UPDATE_START = EventType.UPDATE_START;
InputEvent.UPDATE_END = EventType.UPDATE_END;
