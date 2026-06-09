import React from "react";
import { Button, Container, Table} from "react-bootstrap";
import { Link } from "react-router-dom";
import Pregunta from "./Pregunta.jsx"
import axios from "axios";

class Administrator extends React.Component 
{

    state = {
        data: [],
        showAlert: false,
        alertText: ""
    }

    /*componentDidMount() {
        axios.get("Preguntas").then(response => {
            this.setState({ data: response.data });
        }).catch(error => {
            console.info(error);
            this.setState({ showAlert: true, alertText: "ERROR EN LA OBTENCION DE DATOS" });
        })
    } */

    
    render() {
        const {data,showAlert, alertText } = this.state;        
        return (

            <Container className="MarginContainer" >
                <h1 className="AlignCenter" > Graficador de Gantt </h1>
                <hr style={{ width: "80%" }} />


                <ul>
                    <li>Bazán</li>
                    <li>Lalo</li>
                    <li>Moreno Noguerón Ximena</li>
                    <li>Quecholac</li>
                </ul>

            </Container>

            /* <Container className="MarginContainer" >
                <h1 className="AlignCenter" > CREAR, ALTAS, BAJAS Y CAMBIOS </h1>
                <hr style={{ width: "80%" }} />
                {
                    showAlert ?
                        <Alert variant="danger">
                            {alertText}
                        </Alert>
                        : null
                }                
                <Button variant="info" style={{ margin: "12px" }}>
                    <Link to="/formulario" className="CustomLink">NUEVA PREGUNTA</Link>
                </Button>
                <Table striped bordered >
                    <thead>
                        <tr>
                            <th>Pregunta</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(pregunta => {
                                return <Pregunta {...pregunta} />
                            })
                        }
                    </tbody>
                </Table>

            </Container> */
        )
    }

}

export default Administrator;