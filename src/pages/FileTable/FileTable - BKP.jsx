import React, { useState, useEffect } from "react";
import { useCollection } from "@/hooks/useCollection";
import {
  ChevronDownIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

export default function FileTable() {
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [files, setFiles] = useState([]);
  const { documents: pdfFiles } = useCollection("files");

  useEffect(() => {
    if (pdfFiles) {
      setFiles(pdfFiles);
    }
  }, [pdfFiles]);

  const handleOrderBy = (event) => {
    setOrderBy(event.target.value);
  };

  const handleOrder = (event) => {
    setOrder(event.target.value);
  };

  const handleEdit = (file) => {
    // Implementar a lógica para editar o arquivo
  };

  return (
    <div className="shadow-md rounded-lg overflow-hidden p-8 max-w-4xl ml-20 mr-16 mt-20">
      {/* <div>
        {pdfFiles?.map((pdfFile) => (
          <div key={pdfFile.id}>{pdfFile.name}</div>
        ))}
      </div> */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-lg pb-12">Meus arquivos</h2>
        <div className="flex items-center">
          <div className="flex items-center gap-2.5 border border-gray-300 p-2 mr-2 rounded-lg mt-5 sm:mt-0">
            <MagnifyingGlassIcon className="h-6 w-6 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="focus:outline-none w-full"
              placeholder="Pesquisar"
            />
            <Cross2Icon
              role="button"
              className="text-muted-foreground"
              onClick={() => setSearch("")}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg p-2 mr-2"
            value={orderBy}
            onChange={handleOrderBy}
          >
            <option value="name">Ordenar por:</option>
            <option value="name">Nome</option>
            <option value="category">Categoria</option>
            <option value="createdAt">Data de criação</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg p-2 mr-2"
            value={order}
            onChange={handleOrder}
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>
      </div>

      {/* {error && <div className="bg-red-500 text-white p-4 rounded mb-4">{error}</div>} */}

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
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    onClick={() => handleEdit(file)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
