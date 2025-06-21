import { useState } from "react";

import {
  UserRound,
  BookCopy,
  Puzzle,
  FileQuestion,
  MessageSquare,
  CoinsIcon,
  TextSelect, // Asegúrate de que este icono exista en tu librería
} from "lucide-react";

import { UsuariosCRUD } from './UsuariosCRUD'
import { CategoriasCRUD } from "./CategoriasCRUD";
import { QuizzesCRUD } from "./QuizzesCRUD";
import { ForosCRUD } from "./ForosCRUD";
import { TemarioReader } from "./TemarioReader";
import { QuizGenerator } from "./QuizGenerator";
import { LoginComponent } from "./ObtainToken";

const AdminPanel = () => {
  const [selectedItem, setSelectedItem] = useState('usuarios');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const renderCrudComponent = () => {
    switch (selectedItem) {
      case 'usuarios':
        return <UsuariosCRUD />;
      case 'categorias':
        return <CategoriasCRUD />;
      case 'quizzes':
        return <QuizzesCRUD />;
      case 'foros':
        return <ForosCRUD />;
      case 'subir_temarios': // Asegúrate de que este ID coincida con el onClick en SelectionPanel
        return <TemarioReader />;
      case 'quiz_generator':
        return <QuizGenerator />;
      case 'token_users':
        return <LoginComponent />;
      default:
        return <h2 className="text-xl text-gray-600">Selecciona una opción del menú.</h2>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-64px)] overflow-hidden">
      {/* Drawer button for mobile */}
      <div className="md:hidden flex w-full items-center justify-center bg-gray-100">
        <button
          className="btn btn-outline m-2 w-3/4 items-center"
          onClick={() => setDrawerOpen(true)}
        >
          <span className="material-icons mr-2">menu</span>
          Menú
        </button>
      </div>
      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setDrawerOpen(false)}>
          <div
            className="fixed left-0 top-0 bottom-0 w-64 bg-base-200 shadow-lg z-50 animate-slide-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <span className="font-bold text-lg">Menú</span>
              <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setDrawerOpen(false)}>
                <span className="material-icons">close</span>
              </button>
            </div>
            <SelectionPanel
              selectedItem={selectedItem}
              onSelect={item => {
                setSelectedItem(item);
                setDrawerOpen(false);
              }}
            />
          </div>
        </div>
      )}
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-auto bg-gray-100">
        <SelectionPanel
          selectedItem={selectedItem}
          onSelect={setSelectedItem}
        />
      </div>
      <div className="w-full bg-white p-2 md:p-4 overflow-y-auto">
        {renderCrudComponent()}
      </div>
      {/* Drawer animation style */}
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease;
        }
      `}</style>
      {/* Material icons fallback */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </div>
  );
};

export default AdminPanel;

const SelectionPanel = ({ selectedItem, onSelect }) => {
  const getItemClasses = (itemKey) => {
    return selectedItem === itemKey ? 'text-white bg-primary' : '';
  };
  return (
    <ul className="menu bg-base-200 rounded-box w-full md:w-56 h-auto md:h-full flex-col flex-nowrap md:flex-wrap">
      <li className="menu-title text-gray-800 text-lg font-bold">
        Colecciones
      </li>
      <li className="py-1" onClick={() => onSelect('usuarios')}>
        <a className={getItemClasses('usuarios')}>
          <UserRound />
          Usuarios
        </a>
      </li>
      <li className="py-1" onClick={() => onSelect('categorias')}>
        <a className={getItemClasses('categorias')}>
          <BookCopy />
          Categorías
        </a>
      </li>
      <li className="py-1" onClick={() => onSelect('quizzes')}>
        <a className={getItemClasses('quizzes')}>
          <Puzzle />
          Quizzes
        </a>
      </li>
      <li className="py-1" onClick={() => onSelect('foros')}>
        <a className={getItemClasses('foros')}>
          <MessageSquare />
          Foros
        </a>
      </li>
      <li className="menu-title text-gray-800 text-lg font-bold pt-3">Temario</li>
      <li className="py-1" onClick={() => onSelect('subir_temarios')}>
        <a className={getItemClasses('subir_temarios')}>
          <FileQuestion />
          Subir Temarios
        </a>
      </li>
      <li className="py-1" onClick={() => onSelect('quiz_generator')}>
        <a className={getItemClasses('quiz_generator')}>
          <TextSelect />
          Generar Cuestionarios
        </a>
      </li>
      <li className="menu-title text-gray-800 text-lg font-bold pt-3">Tokens</li>
      <li className="py-1" onClick={() => onSelect('token_users')}>
        <a className={getItemClasses('token_users')}>
          <CoinsIcon />
          Obtener Token
        </a>
      </li>
    </ul>
  );
};