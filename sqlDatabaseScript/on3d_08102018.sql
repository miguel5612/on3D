-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-08-2018 a las 21:43:33
-- Versión del servidor: 10.1.32-MariaDB
-- Versión de PHP: 5.6.36

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `on3d`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agenda`
--

CREATE TABLE `agenda` (
  `idAgenda` int(11) NOT NULL,
  `idCotizacion` int(11) NOT NULL,
  `fechaInicio` datetime NOT NULL,
  `fechaFinal` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `agenda`
--

INSERT INTO `agenda` (`idAgenda`, `idCotizacion`, `fechaInicio`, `fechaFinal`) VALUES
(1, 1, '2018-07-30 04:07:00', '2018-08-03 11:08:00'),
(2, 2, '2018-07-30 04:07:00', '2018-08-03 11:08:00'),
(3, 3, '2018-07-30 04:07:00', '2018-08-03 08:08:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `costosexternosempresa`
--

CREATE TABLE `costosexternosempresa` (
  `idCostosExternos` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `costoDiaDeTrabajo` bigint(20) NOT NULL,
  `costoMantenimientoPorImpresion` bigint(20) NOT NULL,
  `costoLocalArriendo` bigint(20) NOT NULL,
  `adicionalReserva` bigint(20) NOT NULL,
  `porcentajeUtilidad` bigint(20) NOT NULL,
  `IVA` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `costosexternosempresa`
--

INSERT INTO `costosexternosempresa` (`idCostosExternos`, `idUsuario`, `costoDiaDeTrabajo`, `costoMantenimientoPorImpresion`, `costoLocalArriendo`, `adicionalReserva`, `porcentajeUtilidad`, `IVA`) VALUES
(1, 2, 35000, 5000, 800000, 10000, 30, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cotizacion`
--

CREATE TABLE `cotizacion` (
  `idCotizacion` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `emailProveedor` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `emailCliente` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `idFilamento` int(11) NOT NULL,
  `nombreArchivo` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `urlArchivo` varchar(500) COLLATE utf8_spanish2_ci NOT NULL,
  `numeroMetrosEstimado` int(11) NOT NULL,
  `tiempoImpresionEstimado` float NOT NULL,
  `valorImpuestos` float NOT NULL,
  `valorTotal` int(11) NOT NULL,
  `fechaGeneracion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaAbono` datetime NOT NULL,
  `fechaFin` datetime NOT NULL,
  `abonoPagado` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `cotizacion`
--

INSERT INTO `cotizacion` (`idCotizacion`, `idUsuario`, `emailProveedor`, `emailCliente`, `idFilamento`, `nombreArchivo`, `urlArchivo`, `numeroMetrosEstimado`, `tiempoImpresionEstimado`, `valorImpuestos`, `valorTotal`, `fechaGeneracion`, `fechaAbono`, `fechaFin`, `abonoPagado`) VALUES
(1, 2, 'miguelangelcu@ufps.edu.co', 'miguelangelcu@ufps.edu.co', 12, '3D STLL MEDIO FINAL.stl', '/STL/2018072810073D STLL MEDIO FINAL.stl', 612, 3.51, 0, 42235, '2018-07-28 10:00:08', '2018-07-30 04:07:00', '2018-08-03 11:08:00', 0),
(2, 2, 'miguelangelcu@ufps.edu.co', 'miguelangelcu@ufps.edu.co', 12, '3D (1).stl', '/STL/2018072810073D (1).stl', 612, 3.51, 0, 42235, '2018-07-28 10:00:55', '2018-07-30 04:07:00', '2018-08-03 11:08:00', 0),
(3, 2, 'miguelangelcu@ufps.edu.co', 'miguelangelcu@ufps.edu.co', 13, 'impresion final stl parte pequeña.stl', '/STL/201807281007impresion final stl parte pequeña.stl', 232, 0.19, 0, 16466, '2018-07-28 10:01:30', '2018-07-30 04:07:00', '2018-08-03 08:08:00', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datosempresa`
--

CREATE TABLE `datosempresa` (
  `idDatos` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `nombreEmpresa` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `nitEmpresa` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `direccionEmpresa` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `telefonoEmpresa` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `horasReservaEntreTrabajos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `datosempresa`
--

INSERT INTO `datosempresa` (`idDatos`, `idUsuario`, `nombreEmpresa`, `nitEmpresa`, `direccionEmpresa`, `telefonoEmpresa`, `horasReservaEntreTrabajos`) VALUES
(1, 2, 'Onmotica', '1090484958-5', '', '', 32);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `filamento`
--

CREATE TABLE `filamento` (
  `idFilamento` int(11) NOT NULL,
  `idImpresora` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `nombreFilamento` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `tipoFilamento` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `colorFilamento` varchar(30) COLLATE utf8_spanish2_ci NOT NULL,
  `numeroMetros` int(11) NOT NULL,
  `pesoFilamento` int(11) NOT NULL,
  `diametroFilamento` float NOT NULL,
  `costoFilamento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `filamento`
--

INSERT INTO `filamento` (`idFilamento`, `idImpresora`, `idUsuario`, `nombreFilamento`, `tipoFilamento`, `colorFilamento`, `numeroMetros`, `pesoFilamento`, `diametroFilamento`, `costoFilamento`) VALUES
(12, 4, 2, 'Fila Azul', 'ABS', '2A15AB', 80, 500, 1.75, 35000),
(13, 4, 2, 'Fila Verde', 'ABS', '43AB1C', 80, 500, 1.75, 35000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `impresora`
--

CREATE TABLE `impresora` (
  `idImpresora` int(11) NOT NULL,
  `IDUsuario` int(11) NOT NULL,
  `nombreImpresora` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `tamanoCamaCaliente` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `tipoFilamento` varchar(20) COLLATE utf8_spanish2_ci NOT NULL,
  `diametroBoquilla` float NOT NULL DEFAULT '0.4'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `impresora`
--

INSERT INTO `impresora` (`idImpresora`, `IDUsuario`, `nombreImpresora`, `tamanoCamaCaliente`, `tipoFilamento`, `diametroBoquilla`) VALUES
(4, 2, 'printmate3D', '20x20x16', 'ABS', 0.2),
(5, 2, 'Delta Kossel', '20x20x16', 'ABS', 0.4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `email` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `contrasena` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `usuarioActivo` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `email`, `contrasena`, `usuarioActivo`) VALUES
(1, 'miguelangel5612@hotmail.com', 'abcd1234', 1),
(2, 'miguelangelcu@ufps.edu.co', 'Password', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agenda`
--
ALTER TABLE `agenda`
  ADD PRIMARY KEY (`idAgenda`),
  ADD UNIQUE KEY `idCotizacion` (`idCotizacion`);

--
-- Indices de la tabla `costosexternosempresa`
--
ALTER TABLE `costosexternosempresa`
  ADD PRIMARY KEY (`idCostosExternos`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `cotizacion`
--
ALTER TABLE `cotizacion`
  ADD PRIMARY KEY (`idCotizacion`),
  ADD KEY `idUuario` (`idUsuario`);

--
-- Indices de la tabla `datosempresa`
--
ALTER TABLE `datosempresa`
  ADD PRIMARY KEY (`idDatos`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `filamento`
--
ALTER TABLE `filamento`
  ADD PRIMARY KEY (`idFilamento`),
  ADD KEY `idImpresora` (`idImpresora`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `impresora`
--
ALTER TABLE `impresora`
  ADD PRIMARY KEY (`idImpresora`),
  ADD KEY `IDUsuario` (`IDUsuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `agenda`
--
ALTER TABLE `agenda`
  MODIFY `idAgenda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `costosexternosempresa`
--
ALTER TABLE `costosexternosempresa`
  MODIFY `idCostosExternos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `cotizacion`
--
ALTER TABLE `cotizacion`
  MODIFY `idCotizacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `datosempresa`
--
ALTER TABLE `datosempresa`
  MODIFY `idDatos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `filamento`
--
ALTER TABLE `filamento`
  MODIFY `idFilamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `impresora`
--
ALTER TABLE `impresora`
  MODIFY `idImpresora` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
