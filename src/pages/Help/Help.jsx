import React from "react";

export default function Help() {
  return (
    <div className="p-12">
      <h1 className="text-xl font-medium">
        Registre abaixo sua dúvida ou sugestão para o app
      </h1>
      <iframe
        className="py-5 bg-primary-foreground"
        src="https://docs.google.com/forms/d/e/1FAIpQLSc_NCymzQjF6q6afZkjBPFKUev8vWRhVi1CJmk4nIRAop0yXw/viewform?embedded=true"
        width="1150"
        height="900"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
      >
        Carregando…
      </iframe>
    </div>
  );
}
