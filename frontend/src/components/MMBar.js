import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, InputGroup, FormControl } from "react-bootstrap";
import { FaPlus, FaTimes, FaRedo } from "react-icons/fa";
import IconButton from "./IconButton";

function MMBar(props){
    return (
        <Card className = "manage-card d-flex flex-row align-items-center py-3">
                                <div className = "me-auto px-3">
                                    <InputGroup>
                                        <FormControl
                                            placeholder = "Filter entries"
                                            value = {props.filterText}
                                            onChange = {(e) => {
                                                props.setFilterText(e.target.value);
                                            }}
                                            disabled = {props.loading}
                                        />
                                        <Button
                                            variant = "primary"
                                            onClick = {props.handleClear}
                                            disabled = {props.loading}
                                        >
                                                <FaTimes className = "fs-5"/>
                                        </Button>
                                    </InputGroup>
                                </div>
                                <div className = "d-flex flex-row align-items-center px-4 gap-4">
                                    <IconButton
                                        icon ={<FaRedo className = "fs-5"/>}
                                        clickAction = {() => {}} //add refresh
                                    />
                                    <Button
                                        variant = "primary"
                                        className = "d-flex flex-row align-items-center gap-3"
                                        onClick = {props}//add onAdd
                                    >
                                        <FaPlus className = "fs=5"/>
                                        <span className = "d-none d-sm-inline">
                                            {"Add new meter"}
                                        </span>
                                    </Button>
                                </div>
                            </Card >
    );
}

MMBar.propTypes = {
filterText: PropTypes.string,
  setFilterText: PropTypes.func,
  loading: PropTypes.bool,
  handleClear: PropTypes.func,
//   onRefresh: PropTypes.func,
//   onAdd: PropTypes.func,
};

export default MMBar;