package learn.todos.models;

import java.util.ArrayList;
import java.util.List;

public class ValidationErrorResult {
    private ArrayList<String> messages = new ArrayList<>();

    public List<String> getMessages() {
        return new ArrayList<>(messages);
    }

    public void addMessage(String message) {
        messages.add(message);
    }

    public void addMessage(String message, Object... args) {
        addMessage(String.format(message, args));
    }
}
