import React, { useState, useEffect } from 'react';
import Filtro from '@src/componentes/Filtro';
import Card from '@src/componentes/Card';

import { urlGetCartas } from '../../utils/constants';
import PaginationBar from '../../componentes/paginationBar';

const CartasAdmin = () => {
    const [cartas, setCartas] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginasTotales, setPaginasTotales] = useState(0);

    
    const fetchCartasData = async (page) => {
        try {
            const urlWithPage = `${urlGetCartas}?page=${page}&limit=12`;
            const response = await fetch(urlWithPage);
            const data = await response.json();
            setCartas(data.data);
            setPaginasTotales(data.pages);
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

    const filtrarColeccion = (cartas) => {
        return cartas.filter(carta => {
            const cumpleAtaque = (!filtros.ataqueMin || carta.ataque >= filtros.ataqueMin) &&
                                 (!filtros.ataqueMax || carta.ataque <= filtros.ataqueMax);
            const cumpleDefensa = (!filtros.defensaMin || carta.defensa >= filtros.defensaMin) &&
                                  (!filtros.defensaMax || carta.defensa <= filtros.defensaMax);
            const cumplePrecio = (!filtros.precioMin || carta.precio >= filtros.precioMin) &&
                                 (!filtros.precioMax || carta.precio <= filtros.precioMax);
            const cumpleTipo = !Object.values(filtros.tipos).includes(true) || Object.keys(filtros.tipos).some(tipo => filtros.tipos[tipo] && carta.tipo.toLowerCase() === tipo);
            const cumpleAtributo = !Object.values(filtros.atributos).includes(true) || Object.keys(filtros.atributos).some(atributo => filtros.atributos[atributo] && carta.atributo.toLowerCase() === atributo);

            return cumpleAtaque && cumpleDefensa && cumplePrecio && cumpleTipo && cumpleAtributo;
        });
    };

    const cartasFiltradas = filtrarColeccion(cartas);

    return (
        <div>
            <div className='fondo'>
            <h1>Panel Admin Cartas</h1>
            <p>Aquí puedes seleccionar las cartas que quieras habilitar</p>
            <div className="filtrar-cartas">
                <div className="filtro-container">
                    <Filtro categoria="cartas" filtros={filtros} manejarCambioFiltro={manejarCambioFiltro} />
                </div>
                <div className="cartas-container">
                    {cartasFiltradas.map((carta) => (
                        <Card
                            key={carta.id}
                            imagen={carta.imagen}
                            nombre={carta.nombre}
                            descripcion={carta.descripcion}
                            ataque={carta.ataque}
                            defensa={carta.defensa}
                            precio={carta.precio}
                            id={carta.id}
                            cantidad={carta.cantidad}
                            mostrarBotonVer={true}
                        />
                    ))}
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
        </div>
        </div>
    );
};

export default CartasAdmin;