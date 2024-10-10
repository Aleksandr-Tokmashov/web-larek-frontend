import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

export class Modal <T> extends Component<T> {
    protected modal: HTMLElement;
    protected events: IEvents;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
      super(container);
      this.events = events;

      const closeButtonElement = this.container.querySelector(".modal__close");
      this._content = ensureElement<HTMLElement>('.modal__content', container);

      closeButtonElement.addEventListener("click", this.close.bind(this));
      this.container.addEventListener("mousedown", (evt) => {
        if (evt.target === evt.currentTarget) {
          this.close();
        }
      });
      this.handleEscUp = this.handleEscUp.bind(this);
    }
  
    open() {
      this.container.classList.add("modal_active");
      document.addEventListener("keyup", this.handleEscUp);
      
    
    
      window.scrollTo({ top: 0 });
    }
  
    close() {
      this.container.classList.remove("modal_active");
      document.removeEventListener("keyup", this.handleEscUp);
     ;
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
      }
  
    handleEscUp (evt: KeyboardEvent) {
        if (evt.key === "Escape") {
          this.close();
        }
      };
  }
  