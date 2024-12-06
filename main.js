let electron = require("electron");
const path = require("path");
let win;

let template = [
  {
    label: "Trang chủ",
    click: () => {
      win.loadFile("index.html");
    },
  },

  {
    label: "Giới thiệu",
    click: () => {
      win.loadFile("about.html");
    },
  },

  {
    label: "Thoát",
    submenu: [
      { role: "minimize", label: "Thu nhỏ" },
      {
        label: "Thoát khỏi ứng dụng",
        click: () => {
          electron.app.quit();
        },
      },
    ],
  },
];

function taocuaso() {
  win = new electron.BrowserWindow({
    width: 580,
    height: 1000,
    icon: path.join(__dirname, "./images/logo.jpg"),
  });
  win.loadFile("index.html");
  electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(template));

  electron.globalShortcut.register("CmdOrCtrl+Shift+I", () => {
    win.webContents.toggleDevTools();
  });
}

electron.app.whenReady().then(taocuaso);

electron.app.on("browser-window-created", (e, win) => {});
