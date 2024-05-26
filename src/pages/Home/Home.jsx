import React, { useState, useRef } from "react";
import { useFirestore } from "@/hooks/useFirestore";
import uploadToStorage from "@/utils/uploadToStorage";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useUserContext } from "@/hooks/useUserContext";
import { useToast } from "@/shadcn/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Home() {
  // Estados para os campos do formulário
  const [arquivo, setArquivo] = useState(null);
  const [modoSelecao, setModoSelecao] = useState(true);
  const [nomeArquivoOriginal, setNomeArquivoOriginal] = useState("");
  const [nomeArquivo, setNomeArquivo] = useState(nomeArquivoOriginal); // Usa o nome original como valor inicial
  const [categoria, setCategoria] = useState("");
  const [enviandoArquivo, setEnviandoArquivo] = useState(false); // Estado para controlar o envio do arquivo

  // Firebase
  const { addDocument: addFile } = useFirestore("files");
  const { userDoc } = useUserContext();
  const { user } = useAuthContext();

  // Notificação de erro
  const { toast } = useToast();

  // Referência para o input de arquivo oculto
  const inputRef = useRef(null);

  // Função para lidar com o upload de arquivo
  const handleUploadClick = () => {
    inputRef.current.click();
  };

  // Função para lidar com a mudança no campo de upload de arquivo
  const handleUploadArquivo = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setArquivo(file);
    setModoSelecao(false);
    setNomeArquivoOriginal(file?.name);
    setNomeArquivo(file?.name.replace(/.[pP][dD][fF]$/, "")); // Atualiza o nome do arquivo no campo de nome
  };

  // Função para lidar com o arraste do arquivo
  const onDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setArquivo(file);
    setModoSelecao(false);
    setNomeArquivoOriginal(file.name);
    setNomeArquivo(file.name.replace(/\.[pP][dD][fF]$/, ""));
  };

  // Função para lidar com a exclusão do arquivo
  const handleExcluirArquivo = () => {
    inputRef.current.value = null; // Limpa também o valor do input de arquivo -> Me permite o upload do mesmo arquivo novamente
    setArquivo(null);
    setModoSelecao(true);
    setNomeArquivoOriginal("");
    setNomeArquivo("");
  };

  // Função para lidar com a mudança no campo de seleção de categoria
  const handleCategoriaChange = (event) => {
    setCategoria(event.target.value);
  };

  // Função para lidar com a mudança no campo de nome do arquivo
  const handleNomeArquivoChange = (event) => {
    setNomeArquivo(event.target.value);
  };

  // Função para lidar com o envio do formulário
  const createFile = async (event) => {
    event.preventDefault();
    console.log("Arquivo:", arquivo);
    console.log("Nome do arquivo:", nomeArquivo);
    console.log("Categoria:", categoria);
    if (!arquivo || !nomeArquivo || !categoria) return;

    setEnviandoArquivo(true);

    const downloadUrl = await uploadToStorage(
      arquivo,
      `users/${user.uid}/pdfFiles`,
      nomeArquivo
    );

    const { payload: fileId } = await addFile({
      name: nomeArquivo,
      category: categoria,
      fileUrl: downloadUrl,
      lastUpdated: Date.now(),
    });

    toast({
      title: "PDF adicionado",
      description: `Arquivo "${nomeArquivo}" adicionado com sucesso.`,
    });
    inputRef.current.value = null;
    setEnviandoArquivo(false);
    setArquivo(null);
    setModoSelecao(true);
    setNomeArquivoOriginal("");
    setNomeArquivo("");
    setCategoria("Selecione...");
  };

  return (
    <div className="shadow-md rounded-lg overflow-hidden p-8 max-w-4xl mx-auto mt-24">
      <h2 className="text-xl font-semibold mb-4">
        Insira seu arquivo PDF abaixo
      </h2>
      <form onSubmit={createFile}>
        <div className="mb-6 flex items-center">
          <label htmlFor="arquivo" className="block w-1/5">
            Selecione o Arquivo:
          </label>
          <div
            className="border border-gray-300 rounded p-2 w-3/5 ml-auto relative overflow-hidden"
            style={{ height: "4rem" }} // Ajuste aqui para alterar a altura
            onDragOver={(event) => event.preventDefault()}
            onDrop={onDrop}
          >
            {modoSelecao && (
              <label
                className="flex items-center justify-center h-full w-full cursor-pointer hover:bg-gray-200"
                onClick={handleUploadClick}
                onDragOver={(event) => event.preventDefault()}
                onDrop={onDrop}
              >
                Selecione ou arraste aqui
              </label>
            )}
            {!modoSelecao && arquivo && (
              <div className="flex items-center justify-center h-full">
                <span>{nomeArquivoOriginal}</span>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 ml-4"
                  onClick={handleExcluirArquivo}
                >
                  Excluir
                </button>
              </div>
            )}
            {!arquivo && (
              <button
                type="button"
                className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                style={{ height: "4rem" }} // Ajuste aqui para alterar a altura
                onClick={handleUploadClick}
              >
                Selecione ou arraste aqui
              </button>
            )}
            <input
              type="file"
              id="arquivo"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none"
              onChange={handleUploadArquivo}
              ref={inputRef}
            />
          </div>
        </div>
        <div className="mb-6 flex items-center">
          <label htmlFor="nome-arquivo" className="block w-1/5">
            Nome do Arquivo:
          </label>
          <input
            type="text"
            id="nome-arquivo"
            className="border border-gray-300 rounded p-2 w-3/5 ml-auto"
            value={nomeArquivo}
            onChange={handleNomeArquivoChange}
          />
        </div>
        <div className="mb-6 flex items-center">
          <label htmlFor="categoria" className="block w-1/5">
            Categoria:
          </label>
          <select
            id="categoria"
            className="border border-gray-300 rounded p-2 w-3/5 ml-auto"
            value={categoria}
            onChange={handleCategoriaChange}
          >
            <option value="">Selecione...</option>
            <option value="Documentos">Documentos</option>
            <option value="Guias">Guias</option>
            <option value="Pedidos">Pedidos</option>
          </select>
        </div>
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="flex items-center bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
            onClick={createFile}
            disabled={enviandoArquivo} // Desabilita o botão enquanto o arquivo está sendo enviado
          >
            Enviar
            {enviandoArquivo && (
              <ReloadIcon className="animate-spin ml-3" />
            )}{" "}
          </button>
        </div>
      </form>
    </div>
  );
}
