import { MenuPosition } from "../shared/enums/menu-position";
import { MessagePassingService } from "../shared/message-passing-service";
import { SideMenu } from "./side-menu";

const sideMenu = new SideMenu(MenuPosition.Right);
sideMenu.render();
sideMenu.addListeners();
MessagePassingService.addMessageListenerForBackground(() => sideMenu.showMenu());
