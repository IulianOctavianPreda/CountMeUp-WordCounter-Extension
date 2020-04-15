import "./popup.scss";

import { PopupService } from "./services/popup-service";

const service = new PopupService();
service.initializeFromStorage();
service.addListeners();
