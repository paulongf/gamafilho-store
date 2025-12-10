import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative mt-16 bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Marca */}
        <div>
          <h2 className="text-2xl font-bold text-emerald-400">
            GamaFilhoStore
          </h2>
          <p className="mt-3 text-gray-400">
            Moda sustentável criada com propósito. Estilo, qualidade e
            sustentabilidade.
          </p>
        </div>

        {/* Loja */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Loja</h3>
          <ul className="space-y-2">
            <li>
              <Link
                className="hover:text-emerald-400 transition"
                to="/category/jeans"
              >
                Jeans
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-emerald-400 transition"
                to="/category/t-shirts"
              >
                Camisetas
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-emerald-400 transition"
                to="/category/shoes"
              >
                Calçados
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-emerald-400 transition"
                to="/category/bags"
              >
                Bolsas
              </Link>
            </li>
          </ul>
        </div>

        {/* Informações */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Informações</h3>
          <ul className="space-y-2">
            <li>
              <a className="hover:text-emerald-400 transition" href="#">
                Sobre Nós
              </a>
            </li>
            <li>
              <a className="hover:text-emerald-400 transition" href="#">
                Sustentabilidade
              </a>
            </li>
            <li>
              <a className="hover:text-emerald-400 transition" href="#">
                Termos & Privacidade
              </a>
            </li>
            <li>
              <a className="hover:text-emerald-400 transition" href="#">
                Suporte
              </a>
            </li>
          </ul>
        </div>

        {/* Redes Sociais */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Siga-nos</h3>
          <div className="flex space-x-4 text-xl">
            <a className="hover:text-emerald-400 transition" href="#">
              🌐
            </a>
            <a className="hover:text-emerald-400 transition" href="#">
              📸
            </a>
            <a className="hover:text-emerald-400 transition" href="#">
              🐦
            </a>
            <a className="hover:text-emerald-400 transition" href="#">
              🎥
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} GamaFilhoStore — Todos os direitos
        reservados.
      </div>
    </footer>
  );
};

export default Footer;
