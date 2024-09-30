// src/componentes/Cartas.js
import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '@src/context/GlobalContext';
import Filtro from '@src/componentes/Filtro';
import Card from '@src/componentes/Card';
import PaginationBar from '../../componentes/paginationBar';
import { FaChevronDown } from 'react-icons/fa'; // Import the down arrow icon
import './Cartas.css';

import { urlGetCartasEnInventario } from '../../utils/constants';

function Cartas() {
    const [cartas, setCartas] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginasTotales, setPaginasTotales] = useState(0);

    const fetchCartasData = async (page) => {
        try {
            const urlWithPage = `${urlGetCartasEnInventario}?page=${page}&limit=12`;
            const response = await fetch(urlWithPage);
            const data = await response.json();
            setCartas(data.data);
            setPaginasTotales(data.pages);

            console.log(data.data);
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {

        // Fetch cards when the component mounts
        fetchCartasData(paginaActual);

    }, [paginaActual]);

    const handlePrevPage = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        }
    }

    const handleNextPage = () => {
        if (paginaActual < paginasTotales) {
            setPaginaActual(paginaActual + 1);
        }
    }


    const { busqueda } = useContext(GlobalContext);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [filtros, setFiltros] = useState({
        ataqueMin: '',
        ataqueMax: '',
        defensaMin: '',
        defensaMax: '',
        precioMin: '',
        precioMax: '',
        tipos: {
            monstruo: false,
            hechizo: false,
            trampa: false
        },
        atributos: {
            fuego: false,
            agua: false,
            tierra: false,
            viento: false,
            luz: false,
            oscuridad: false
        }
    });

    const manejarCambioFiltro = (e) => {
        const { name, value, type, checked } = e.target;
        const [category, key] = name.split('.');

        if (type === 'checkbox') {
            setFiltros((prevState) => ({
                ...prevState,
                [category]: {
                    ...prevState[category],
                    [key]: checked
                }
            }));
        } else {
            setFiltros((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const filtrarCartas = (cartas) => {
        return cartas.filter(carta => {
            const cumpleBusqueda = carta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            carta.descripcion.toLowerCase().includes(busqueda.toLowerCase());
            const cumpleAtaque = (!filtros.ataqueMin || carta.ataque >= filtros.ataqueMin) &&
                                (!filtros.ataqueMax || carta.ataque <= filtros.ataqueMax);
            const cumpleDefensa = (!filtros.defensaMin || carta.defensa >= filtros.defensaMin) &&
                                (!filtros.defensaMax || carta.defensa <= filtros.defensaMax);
            const cumplePrecio = (!filtros.precioMin || carta.precio >= filtros.precioMin) &&
                                (!filtros.precioMax || carta.precio <= filtros.precioMax);
            const cumpleTipo = !Object.values(filtros.tipos).includes(true) || Object.keys(filtros.tipos).some(tipo => filtros.tipos[tipo] && carta.tipo.toLowerCase() === tipo);
            const cumpleAtributo = !Object.values(filtros.atributos).includes(true) || Object.keys(filtros.atributos).some(atributo => filtros.atributos[atributo] && carta.atributo.toLowerCase() === atributo);

            return cumpleBusqueda && cumpleAtaque && cumpleDefensa && cumplePrecio && cumpleTipo && cumpleAtributo;
        });
    };

    const cartasFiltradas = filtrarCartas(cartas);

    return (
        <div className='fondo'>
            <h1>CARTAS</h1>
            {/* Mobile filter button */}
            <div className="mobile-filter-button" onClick={() => setIsModalOpen(true)}>
                <FaChevronDown /> Filtrar
            </div>

            <div className="filtrar-cartas">
                {/* Filters container (visible only on larger screens) */}
                <div className={`filtro-container ${isModalOpen ? 'modal-open' : ''}`}>
                    <Filtro categoria="cartas" filtros={filtros} manejarCambioFiltro={manejarCambioFiltro} />
                </div>
                
                {/* Cards container */}
                <div className="cartas-container">
                    {cartasFiltradas.length > 0 ? (
                        cartasFiltradas.map((carta) => (
                            <Card
                                key={carta.id}
                                imagen={carta.imagen}
                                nombre={carta.nombre}
                                descripcion={carta.descripcion}
                                ataque={carta.ataque}
                                defensa={carta.defensa}
                                precio={carta.precio}
                                tipo={carta.tipo}
                                atributo={carta.atributo}
                                id={carta.id}
                                cantidad={carta.cantidad}
                                tipoDetalle="compra"
                            />
                        ))
                    ) : (
                        <p className="no-cartas">No hay cartas disponibles en este momento</p>
                    )}
                </div>
            </div>

            <div>
                <PaginationBar
                    paginasTotales={paginasTotales}
                    paginaActual={paginaActual}
                    handlePaginate={setPaginaActual}
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                />
            </div>    

            {/* Filter modal for mobile */}
            {isModalOpen && (
                <div className="filtro-modal">
                    <div className="modal-content">
                        <Filtro categoria="cartas" filtros={filtros} manejarCambioFiltro={manejarCambioFiltro} />
                        <button className="close-modal" onClick={() => setIsModalOpen(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cartas;
