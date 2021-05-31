var EventType;
(function(EventType2) {
  EventType2["Focus"] = "focus";
  EventType2["Blur"] = "blur";
  EventType2["Update"] = "update";
  EventType2["UpdatePeriodically"] = "update-periodically";
  EventType2["UpdateStart"] = "update-start";
  EventType2["UpdateEnd"] = "update-end";
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
InputEvent.Focus = EventType.Focus;
InputEvent.Blur = EventType.Blur;
InputEvent.Update = EventType.Update;
InputEvent.UpdatePeriodically = EventType.UpdatePeriodically;
InputEvent.UpdateStart = EventType.UpdateStart;
InputEvent.UpdateEnd = EventType.UpdateEnd;
