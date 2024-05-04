import React, { useState, useRef } from "react";

export default function Home() {
  // Estados para os campos do formulário
  const [arquivo, setArquivo] = useState(null);
  const [modoSelecao, setModoSelecao] = useState(true);
  const [nomeArquivoOriginal, setNomeArquivoOriginal] = useState("");
  const [nomeArquivo, setNomeArquivo] = useState(nomeArquivoOriginal); // Usa o nome original como valor inicial
  const [categoria, setCategoria] = useState("");

  // Referência para o input de arquivo oculto
  const inputRef = useRef(null);

  // Função para lidar com o upload de arquivo
  const handleUploadClick = () => {
    inputRef.current.click();
  };

  // Função para lidar com a mudança no campo de upload de arquivo
  const handleUploadArquivo = (event) => {
    const file = event.target.files[0];
    setArquivo(file);
    setModoSelecao(false);
    setNomeArquivoOriginal(file?.name);
    setNomeArquivo(file?.name.replace(".pdf", "")); // Atualiza o nome do arquivo no campo de nome
    // inputRef.current.value = null; // Limpa o valor do input de arquivo
  };

  // Função para lidar com o arraste do arquivo
  const onDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setArquivo(file);
    setModoSelecao(false);
    setNomeArquivoOriginal(file.name);
    setNomeArquivo(file.name.replace(".pdf", ""));
    // inputRef.current.value = null; // Limpa o valor do input de arquivo
  };

  // Função para lidar com a exclusão do arquivo
  const handleExcluirArquivo = () => {
    setArquivo(null);
    setModoSelecao(true);
    setNomeArquivoOriginal("");
    setNomeArquivo("");
    // inputRef.current.value = null; // Limpa também o valor do input de arquivo
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
  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você pode enviar os dados do formulário para o backend
    console.log("Arquivo:", arquivo);
    console.log("Nome do arquivo:", nomeArquivo);
    console.log("Categoria:", categoria);
  };

  return (
    <div className="shadow-md rounded-lg overflow-hidden p-8 max-w-4xl mx-auto mt-24">
      <h2 className="text-xl font-semibold mb-4">
        Insira seu arquivo PDF abaixo
      </h2>
      <form onSubmit={handleSubmit}>
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
            <option value="categoria1">Categoria 1</option>
            <option value="categoria2">Categoria 2</option>
            <option value="categoria3">Categoria 3</option>
          </select>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
