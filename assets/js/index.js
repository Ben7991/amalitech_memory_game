import DomManipulator from "./logic/DomManipulator.js";

class App
{
    static manipulator = null;

    static init() {
        this.manipulator = new DomManipulator();
        this.manipulator.init();
    }
}

App.init();