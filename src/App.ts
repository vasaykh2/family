// @ts-ignore
import { createApp } from "vue";
import families from "./assets/families.json";
import AttachFamilyModal from "./Templates/AttachFamilyModal.vue";
import AddFamilyButton from "./Templates/AddFamilyButton.vue";
import config from "./config";
// import "./assets/global.scss";

export default class App {
  protected amoWidget: unknown;
  protected mode: string;
  protected AmoCRM = (window as any).APP;

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
    // const regionsData = regions;
    // const countries = regionsData["Страны"];
    // const dataArray = this.getArrayData(countries);
    // const tips = this.getTips(dataArray);
    // @ts-ignore
    console.debug("++++++ APP.data", this.AmoCRM.data);
    if (
      this.AmoCRM.data.current_entity === "contacts" &&
      this.AmoCRM.data.is_card
    ) {
      const $familyField = `
    <div class="linked-form__multiple-container" >
        <div class="linked-form__field linked-form__field-text">
          <div class="linked-form__field__label" title="Семья">
            <span>Семья</span>
          </div>
          <div class="linked-form__field__value">
          <input name="CFV[${config.family_field}]" class="linked-form__cf text-input" type="text" placeholder="..." spellcheck="false" autocomplete="off">
          </div>       
    </div>
    </div> 
`;
      const $typeOfContactField = `    
    <div class="linked-form__multiple-container" >
        <div class="linked-form__field linked-form__field-text">
          <div class="linked-form__field__label" title="Тип контакта">
            <span>Тип контакта</span>
          </div>
          <div class="linked-form__field__value">
          <input name="CFV[${config.type_contact_field}]" class="linked-form__cf text-input" type="text" placeholder="..." spellcheck="false" autocomplete="off">
          </div>       
    </div>
    </div>    
`;
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
        if ($familyFieldInput.val()) {
          this.openEditFamilyModal();
        } else {
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
      // modalId: modalId,
      newFamilyId: modalId,
      families: arrOfFamilies,
      // attachFamily: this.handleAttachFamily.bind(this),
      // viewContacts: this.handleViewContacts.bind(this),
      // createFamily: this.handleCreateFamily.bind(this),
    });

    const AddFamilyButtonComponent = createApp(AddFamilyButton as any, {
      title: "string",
      limit: 12,
      loading: false,
    });

    // const AttachFamilyModalComponent =
    //   (AttachFamilyModal as any,
    //   {
    //     newFamilyId: modalId,
    //     families: arrOfFamilies,
    //   });

    // AttachFamilyModalComponent.provide("newFamilyId", modalId);
    // AttachFamilyModalComponent.provide("families", arrOfFamilies);

    const $container = $(
      '<div id="AttachFamilyModal" class="modal-overlay"></div>'
    );
    AddFamilyButtonComponent.mount($container[0]);
    $body.append($container);

    $container.css({
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(242, 242, 242, 0.7)",
      padding: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    });

    $("#card_holder").on("click", ".modal-overlay", (e: any) => {
      if (e.target === e.currentTarget) {
        $(".modal-overlay").remove();
      }
    });
  }

  public handleAttachFamily(familyId: string) {
    console.log("AttachFamily", familyId);
    // ...
  }

  public handleViewContacts(memberId: string) {
    console.log("ViewContacts", memberId);
    // ...
  }

  public handleCreateFamily(familyId: string) {
    console.log("CreateFamily", familyId);
    // ...
  }

  public openEditFamilyModal(): void {
    // Реализуйте код для открытия модального окна "Редактировать семью"
    const modalContent = `
      <div id="edit-family-modal" class="modal">
          <div class="modal-content">
              <span class="close-button">&times;</span>
              <h2>Редактировать семью</h2>
              <div id="family-members">
                  <!-- Динамически сгенерированный список членов семьи -->
              </div>
              <button id="detach-family">Открепить семью</button>
          </div>
      </div>
  `;
    $("body").append(modalContent);
    // Здесь должен быть код для редактирования членов семьи
  }
}
