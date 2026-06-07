import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Pregunta = ({ id, pregunta }) => {
    return (
        <tr>
            <td>{pregunta}</td>
            <td className="AlignCenter">
                <Button
                    variant="success"
                    className="M-6">
                    <Link to={`/info?id=${id}`} className="CustomLink" >
                        Ver pregunta
                    </Link>
                </Button>
                <Button
                    variant="warning"
                    className="M-6">
                    <Link to={`/editar?id=${id}`} className="CustomLink" >
                        Editar pregunta
                    </Link>
                </Button>
                <Button
                    variant="danger"
                    className="M-6">
                    <Link to={`/eliminar?id=${id}`} className="CustomLink" >
                        Eliminar pregunta
                    </Link>                    
                </Button>
            </td>
        </tr>
    )
}
export default Pregunta;