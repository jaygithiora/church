import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { CiSearch } from 'react-icons/ci'

function SearchBox() {
    return (
        <div className='searchBox'>
            <InputGroup>
                <InputGroup.Text className='border-0'><CiSearch /></InputGroup.Text>
                <Form.Control type='search' placeholder='Search'/>
            </InputGroup>
        </div>
    )
}

export default SearchBox