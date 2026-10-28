type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export const isFormControl = (element: EventTarget | Element | RadioNodeList | null): element is FormControl =>
  element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement;

const getValidationMessage = (control: FormControl) => {
  if (control.validity.valueMissing) return "Completa este campo.";
  if (control.validity.typeMismatch) {
    return control.type === "email" ? "Ingresa un correo válido." : "Ingresa una URL válida.";
  }
  if (control.validity.tooShort && "minLength" in control) {
    return `Usa al menos ${control.minLength} caracteres.`;
  }
  return control.validationMessage || "Revisa este campo.";
};

export const setFieldError = (control: FormControl, message = getValidationMessage(control)) => {
  control.setAttribute("aria-invalid", "true");

  const errorId = control.dataset.errorId;
  const errorNode = errorId ? document.getElementById(errorId) : null;
  if (!(errorNode instanceof HTMLElement)) return;

  control.setAttribute("aria-errormessage", errorNode.id);
  errorNode.textContent = message;
  errorNode.hidden = false;
};

export const clearFieldError = (control: FormControl) => {
  control.removeAttribute("aria-invalid");
  control.removeAttribute("aria-errormessage");

  const errorId = control.dataset.errorId;
  const errorNode = errorId ? document.getElementById(errorId) : null;
  if (!(errorNode instanceof HTMLElement)) return;

  errorNode.textContent = "";
  errorNode.hidden = true;
};

export const clearFormFieldErrors = (form: HTMLFormElement) => {
  Array.from(form.elements).forEach((element) => {
    if (isFormControl(element)) clearFieldError(element);
  });
};
