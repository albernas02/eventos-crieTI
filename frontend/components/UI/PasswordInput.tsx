import { InputGroup, InputRightElement, Button, Input } from "@chakra-ui/react"
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState } from "react"

export default function PasswordInput({...props}) {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    return (
        <InputGroup size='md'>
            <Input
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                {...props}
            />
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick} variant={"ghost"}>
                    {show ? <IoEyeOff />  : <IoEye/>}
                </Button>
            </InputRightElement>
        </InputGroup>
    )
}