// @ts-ignore
import { createApp } from "vue";
import families from "./assets/families.json";
// import AttachFamilyModal from "./Templates/AttachFamilyModal.vue";
import AttachFamilyModal from "./Templates/ui/AttachFamilyModal.vue";

import AddFamilyButton from "./Templates/AddFamilyButton.vue";
import config from "./config";
// import "./assets/global.scss";

export default class App {
  protected amoWidget: unknown;
  protected mode: string;
  protected AmoCRM: any;

  settings = {
    familyField: config.family_field,
    typeContactField: config.type_contact_field,
    childOrparentField: config.child_field_or_parent,
    modeInLeads: config.mode_in_leads,
  };
  showAttachModal = false;

  constructor(amoWidget: unknown, mode: string) {
    this.amoWidget = amoWidget;
    this.mode = mode;
    this.AmoCRM = (window as any).APP;
  }

  public getCallbacks(): Record<string, () => boolean | unknown> {
    const self = this;
    const methodsMap = {
      init: "onInit",
      bind_actions: "onBindActions",
      render: "onRender",
      dpSettings: "onDigitalPipelineSettings",
      settings: "onSettings",
      advancedSettings: "onAdvancedSettings",
      onSave: "onSave",
      destroy: "onDestroy",
      onAddAsSource: "onAddAsSource",
    };

    return Object.fromEntries(
      Object.entries(methodsMap)
        // @ts-ignore
        .map(([key, callback]) => [
          key,
          // @ts-ignore
          typeof self[callback] === "function"
            ? // @ts-ignore
              self[callback].bind(self)
            : self.defaultCallback.bind(self),
        ])
    );
  }

  public defaultCallback(): boolean {
    return true;
  }

  public render(
    template: string,
    params: Record<string | number, unknown> = {}
  ): Promise<string> {
    params = typeof params == "object" ? params : {};
    template = template || "";

    return new Promise((resolve) => {
      // @ts-ignore
      this.amoWidget.render.call(
        this.amoWidget,
        {
          href: "/templates/" + template + ".twig",
          // @ts-ignore
          base_path: this.amoWidget.get_settings()?.path,
          load: (template: { render: ({}) => string }) =>
            resolve(template.render(params)),
        },
        params
      );
    });
  }

  public onInit(): boolean {
    return true;
  }

  public async onSettings(): Promise<boolean> {
    () => console.debug("onSettings");
    return true;
  }
  public async onRender(): Promise<boolean> {
    $("head").append(
      `<link type="text/css" rel="stylesheet" href="${
        // @ts-ignore
        this.amoWidget.params.path
      }/style.css?v=${Date.now()}" >`
    );

    // @ts-ignore
    console.debug("++++++ APP.data", this.AmoCRM.data);
    if (
      this.AmoCRM.data.current_entity === "contacts" &&
      this.AmoCRM.data.is_card
    ) {
      const $familyField = `<input name="CFV[${this.settings.familyField}]">`;
      const $typeOfContactField = `<input name="CFV[${this.settings.typeContactField}]">`;
      // Вставка на 4-ю и 5-ю позицию
      $(".linked-forms__group-wrapper_main")
        .children()
        .eq(1)
        .after($($familyField));
      $(".linked-forms__group-wrapper_main")
        .children()
        .eq(2)
        .after($($typeOfContactField));

      this.getFamilyButton();
    }

    return true;
  }

  public getFamilyButton(): void {
    // @ts-ignore
    $(() => {
      const $familyFieldInput = $(`input[name="CFV[${config.family_field}]"]`);
      const $familyButton = $(
        '<button id="family-button" type="button"></button>'
      );
      $familyFieldInput.after($familyButton);

      $familyButton.css({
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "white",
        border: "1px solid #dfdfdf",
        cursor: "pointer",
        textAlign: "left",
        padding: "0 10px",
        boxSizing: "border-box",
      });

      $familyFieldInput.css({
        position: "relative",
        zIndex: -1,
      });

      const checkFamilyField = () => {
        if ($familyFieldInput.val()) {
          $familyButton.text("Редактировать семью");
        } else {
          $familyButton.text("+ Прикрепить семью");
        }
      };

      checkFamilyField();

      // $familyFieldInput.on("input", checkFamilyField);

      $familyButton.on("click", async () => {
        if (!$familyFieldInput.val()) {
          await this.openAttachFamilyModal();
        }
      });
    });
  }

  public async openAttachFamilyModal(): Promise<void> {
    const modalId = Math.random();
    const arrOfFamilies = families.families;

    this.showAttachModal = true;
    const $body = $("body").find("#card_holder");
    const AttachFamilyModalComponent = createApp(AttachFamilyModal as any, {
      newFamilyId: modalId,
      families: arrOfFamilies,
    });

    const AddFamilyButtonComponent = createApp(AddFamilyButton as any, {
      title: "string",
      limit: 12,
      loading: false,
    });

    const $container = $(
      '<div id="FamilyContacts" class="family-contacts-container"></div>'
    );
    AttachFamilyModalComponent.mount($container[0]);
    $body.append($container);

    // $container.css({
    //   position: "fixed",
    //   top: "0",
    //   left: "0",
    //   width: "100%",
    //   height: "100%",
    //   backgroundColor: "rgba(242, 242, 242, 0.7)",
    //   padding: "20px",
    //   display: "flex",
    //   justifyContent: "center",
    //   alignItems: "center",
    //   zIndex: 1000,
    // });

    $("#card_holder").on("click", ".modal-overlay", (e: any) => {
      if (e.target === e.currentTarget) {
        $(".modal-overlay").remove();
      }
    });
  }
}
