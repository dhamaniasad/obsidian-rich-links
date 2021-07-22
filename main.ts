import {
  App,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  Editor,
} from "obsidian";

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: "default",
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    console.log("loading plugin");

    await this.loadSettings();

//     this.addRibbonIcon("link", "Rich Links", () => {
//       new Notice("This is a notice!");
//     });

//     this.addStatusBarItem().setText("Status Bar Text");

    // this.addCommand({
    // 	id: 'open-sample-modal',
    // 	name: 'Open Sample Modal',
    // 	// callback: () => {
    // 	// 	console.log('Simple Callback');
    // 	// },
    // 	checkCallback: (checking: boolean) => {
    // 		let leaf = this.app.workspace.activeLeaf;
    // 		if (leaf) {
    // 			if (!checking) {
    // 				new SampleModal(this.app).open();
    // 			}
    // 			return true;
    // 		}
    // 		return false;
    // 	}
    // });

    this.addCommand({
      id: "create-rich-links",
      name: "Create Rich Links",
      // callback: () => {
      // 	console.log('Simple Callback');
      // },
      checkCallback: (checking: boolean) => {
        let leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          if (!checking) {
            this.urlToIframe();
          }
          return true;
        }
        return false;
      },
    });

    // this.addSettingTab(new SampleSettingTab(this.app, this));

//     this.registerCodeMirror((cm: CodeMirror.Editor) => {
//       console.log("codemirror", cm);
//     });

//     this.registerDomEvent(document, "click", (evt: MouseEvent) => {
//       console.log("click", evt);
//     });

//     this.registerInterval(
//       window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
//     );
  }

  onunload() {
    console.log("unloading plugin");
  }

  isUrl(text: string): boolean {
    const urlRegex = new RegExp(
      "^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$"
    );
    return urlRegex.test(text);
  }

  urlToIframe(): void {
    let activeLeaf: any = this.app.workspace.activeLeaf;
    let editor = activeLeaf.view.sourceMode.cmEditor;
    let selectedText = editor.somethingSelected()
      ? editor.getSelection()
      : false;

    if (selectedText && this.isUrl(selectedText)) {
      const url = selectedText;
      ajaxPromise({
        url: `http://iframely.server.crestify.com/iframely?url=${url}`,
      }).then((res) => {
		  const data = JSON.parse(res);
		  const imageLink = data.links[0].href || '';
//         console.log("res: ", res);
        editor.replaceSelection(`
<div class="rich-link-card-container"><a class="rich-link-card" href="#" target="_blank">
	<div class="rich-link-image-container">
		<div class="rich-link-image" style="background-image: url('${imageLink}')">
	</div>
	</div>
	<div class="rich-link-card-text">
		<h1 class="rich-link-card-title">${data.meta.title || ""}</h1>
		<p class="rich-link-card-description">
		${data.meta.description || ""}
		</p>
		<p class="rich-link-href">
		${url}
		</p>
	</div>
</a></div>

`);
      });
    }
    {
      new Notice("Select a URL to convert to rich link.");
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SampleModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    let { contentEl } = this;
    contentEl.setText("Woah!");
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}

// class SampleSettingTab extends PluginSettingTab {
//   plugin: MyPlugin;

//   constructor(app: App, plugin: MyPlugin) {
//     super(app, plugin);
//     this.plugin = plugin;
//   }

//   display(): void {
//     // let { containerEl } = this;

//     // containerEl.empty();

//     // containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

//     // new Setting(containerEl)
//     //   .setName("Setting #1")
//     //   .setDesc("It's a secret")
//     //   .addText((text) =>
//     //     text
//     //       .setPlaceholder("Enter your secret")
//     //       .setValue("")
//     //       .onChange(async (value) => {
//     //         console.log("Secret: " + value);
//     //         this.plugin.settings.mySetting = value;
//     //         await this.plugin.saveSettings();
//     //       })
//     //   );
//   }
// }
