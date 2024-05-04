import React, { useState } from "react";

export default function EditableRow({ file, isEditing, onEdit, onSave }) {
  const [editedFile, setEditedFile] = useState({ ...file });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedFile((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSaveClick = () => {
    onSave(file.id, editedFile);
    onEdit(null);
  };

  return (
    <tr>
      <td className="border border-gray-400 px-4 py-2">
        {isEditing ? (
          <input
            type="text"
            name="nome"
            value={editedFile.nome}
            onChange={handleChange}
            className="px-2 py-1 border border-gray-300 rounded"
          />
        ) : (
          file.nome
        )}
      </td>
      <td className="border border-gray-400 px-4 py-2">
        {isEditing ? (
          <input
            type="text"
            name="categoria"
            value={editedFile.categoria}
            onChange={handleChange}
            className="px-2 py-1 border border-gray-300 rounded"
          />
        ) : (
          file.categoria
        )}
      </td>
      <td className="border border-gray-400 px-4 py-2">{file.dataCriacao}</td>
      <td className="border border-gray-400 px-4 py-2">
        {/* Adicione o link para o arquivo PDF armazenado no Storage */}
        <a
          href={`url_do_seu_storage/${file.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir
        </a>
      </td>
      <td className="border border-gray-400 px-4 py-2">
        {isEditing ? (
          <button
            onClick={handleSaveClick}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
          >
            Salvar
          </button>
        ) : (
          <button
            onClick={() => onEdit(file.id)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          >
            Editar
          </button>
        )}
      </td>
    </tr>
  );
}
