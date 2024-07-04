// @ts-ignore
import { createApp } from "vue";
import families from "./assets/families.json";
import AttachFamilyModal from "./Templates/ui/AttachFamilyModal.vue";
import config from "./config";

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

      const modalId = config.new_family_id;
      const arrOfFamilies = families.families;

      const $body = $("body").find("#card_holder");
      const AttachFamilyModalComponent = createApp(AttachFamilyModal as any, {
        newFamilyId: modalId,
        families: arrOfFamilies,
      });
      const $container = $(
        '<div id="FamilyContacts" class="family-contacts-container"></div>'
      );
      AttachFamilyModalComponent.mount($container[0]);
      $body.append($container);
    }

    return true;
  }
}
