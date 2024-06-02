import React, { useState, useEffect } from "react";
import { useCollection } from "@/hooks/useCollection";
import { useFirestore } from "@/hooks/useFirestore";
import {
  Cross2Icon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

export default function FileTable() {
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  // const [order, setOrder] = useState("asc");
  const [files, setFiles] = useState([]);

  const [showDeleteCard, setShowDeleteCard] = useState(false);
  const [fileToDeleteId, setFileToDeleteId] = useState(null);
  const [fileToDeleteName, setFileToDeleteName] = useState(null);

  const { documents: pdfFiles } = useCollection("files");
  const { deleteDocument: deleteFile } = useFirestore("files");

  useEffect(() => {
    if (pdfFiles) {
      setFiles(pdfFiles);
    }
  }, [pdfFiles]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowDeleteCard(false);
      }
    };
    if (showDeleteCard) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showDeleteCard]);

  const handleOrderBy = (event) => {
    setOrderBy(event.target.value);
  };

  const handleOrder = (event) => {
    setOrder(event.target.value);
  };

  const handleDelete = (id, name) => {
    setFileToDeleteId(id);
    setFileToDeleteName(name);
    setShowDeleteCard(true);
  };

  return (
    <div className="shadow-md rounded-lg overflow-hidden p-8 max-w-4xl ml-44 mr-20 mt-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-lg pb-12">Meus arquivos</h2>
        <div className="flex items-center">
          <div className="flex items-center gap-2.5 border border-gray-300 p-2 mr-2 rounded-lg mt-5 sm:mt-0">
            <MagnifyingGlassIcon className="h-6 w-6 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="focus:outline-none w-full bg-primary-foreground"
              placeholder="Pesquisar"
            />
            <Cross2Icon
              role="button"
              className="text-muted-foreground"
              onClick={() => setSearch("")}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg p-2 mr-2 bg-primary-foreground"
            value={orderBy}
            onChange={handleOrderBy}
          >
            <option value="">Ordenar por:</option>
            <option value="name">Nome</option>
            <option value="category">Categoria</option>
            <option value="createdAt">Data de criação</option>
          </select>
        </div>
      </div>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Categoria</th>
            {/* <th className="px-4 py-2">Data de criação</th> */}
            <th className="px-4 py-2">Arquivo</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {files
            ?.filter(
              (file) =>
                file.name.toLowerCase().includes(search.toLowerCase()) ||
                file.category.toLowerCase().includes(search.toLowerCase())
            )
            ?.sort((a, b) => {
              if (orderBy === "name") {
                return a.name.localeCompare(b.name);
              } else if (orderBy === "category") {
                return a.category.localeCompare(b.category);
              } else if (orderBy === "createdAt.toDate()") {
                return (
                  new Date(a.createdAt.toDate()) -
                  new Date(b.createdAt.toDate())
                );
              }
              return 0;
            })
            ?.map((file) => (
              <tr key={file.id}>
                <td className="px-4 py-2 text-justify">{file.name}</td>
                <td className="px-4 py-2 text-center">{file.category}</td>
                <td className="px-4 py-2 text-center">
                  <a href={file.fileUrl} target="_blank">
                    Abrir arquivo
                  </a>
                </td>
                {/* <td className="px-4 py-2">{file.createdAt}</td> */}
                <td className="px-4 py-2 text-center">
                  <button
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500 ml-2"
                    onClick={() => handleDelete(file.id, file.name)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showDeleteCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-primary-foreground p-6 rounded-lg ml-44">
            <p className="mb-4">
              Você tem certeza que deseja excluir o arquivo {fileToDeleteName}?
            </p>
            <p className="mb-4 text-red-700 font-bold">
              Esta ação não pode ser desfeita!
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mr-2"
                onClick={() => setShowDeleteCard(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500"
                onClick={() => {
                  deleteFile(fileToDeleteId);
                  setShowDeleteCard(false);
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
