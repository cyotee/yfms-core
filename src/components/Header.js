import React from "react"
import { Navbar, Nav, Form, NavDropdown, FormControl, Button } from "react-bootstrap"
import styled from "styled-components"

const Container = styled.div`
  width: 100%;
`

const Title = styled.span`
  font-family: "Times New Roman", Times, serif;
  font-weight: bold;
  font-size: 2rem;
  margin-right: 1vw;
  font-shadow: 1px 1px #000;
`

const Motto = styled.span`
  font-family: "Times New Roman", Times, serif;
  font-size: 0.75rem;
  font-style: italic;
`

const Header = () => {
  return (
    <Container>
      <Navbar variant="dark" expand="true">
        <Navbar.Brand style={{"position":"absolute","width":"100%","text-align":"center"}} href="#home">
          <Title>YFMoonshot</Title>
          <Motto>live on the moon. </Motto>
        </Navbar.Brand>
        <Navbar.Toggle style={{"background-color":"#333","color":"#000","z-index":"10"}} aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  )
}

export default Header
