'use client'

import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Text,
    Drawer,
    DrawerContent,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Heading,
} from '@chakra-ui/react'
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
} from 'react-icons/fi'
import { IconType } from 'react-icons'
import { Children, useContext } from 'react'
import { TbCalendar } from "react-icons/tb";
import { IoTicketOutline } from "react-icons/io5";
import { HiOutlineCalendar, HiOutlineCalendarDays, HiOutlineUsers } from "react-icons/hi2";
import { Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { parseCookies } from 'nookies'
import NextNProgress from "nextjs-progressbar";
import { AuthContext } from '@/contexts/AuthContext'
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { RxExit } from "react-icons/rx";
import { HiOutlineDocumentReport } from "react-icons/hi";

interface LinkItemProps {
    name: string
    icon: IconType
    href: string
    permission?: string
}

interface NavItemProps extends FlexProps {
    icon: IconType
    children: React.ReactNode
    href: string
    permission?: string
}

interface MobileProps extends FlexProps {
    onOpen: () => void
}

interface SidebarProps extends BoxProps {
    onClose: () => void
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Eventos', icon: HiOutlineCalendarDays, href: "/eventos" },
    { name: 'Usuários', icon: HiOutlineUsers, href: "/admin/clientes", permission: "users" },
    { name: 'Relatório de Eventos', icon: HiOutlineDocumentReport, href: "/admin/encerrados", permission: "users" },
    { name: 'Gerenciar Eventos', icon: HiOutlineCalendarDays, href: "/admin/eventos", permission: "users" },
    { name: 'Inscrições', icon: IoTicketOutline, href: "/inscricoes", permission: "clients" },
    { name: 'Gerenciar Admin', icon: MdOutlineAdminPanelSettings, href: "/admin/usuarios", permission: "users" },
]

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Flex gap="3" align="center">
                    <Image src="/imagens/92969c3c-5d00-4121-a391-1c3d06d2f072.png" height="45px" width="55px" alt='logo' />
                    <Heading display="flex" gap="1" fontSize={"xl"}>Crie<Text color="purple.500">Eventos</Text></Heading>
                </Flex>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} href={link.href} permission={link.permission}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    )
}

const NavItem = ({ icon, href, children, permission, ...rest }: NavItemProps) => {
    const router = useRouter();
    const isActive = router.pathname == href || (href != '/' && router.pathname.startsWith(href));

    if (permission) {
        const { auth_type } = parseCookies();

        if (permission != auth_type) {
            return <></>;
        }
    }


    return (
        <Link href={href} style={{ textDecoration: "none" }}>
            <Box
                style={{ textDecoration: 'none' }}
                _focus={{ boxShadow: 'none' }}>
                <Flex
                    align="center"
                    p="4"
                    mx="4"
                    borderRadius="lg"
                    role="group"
                    cursor="pointer"
                    color={isActive ? 'purple.400' : undefined}
                    fontWeight={isActive ? 'semibold' : undefined}
                    _hover={{
                        bg: 'purple.400',
                        color: 'white',
                    }}
                    {...rest}>
                    {icon && (
                        <Icon
                            mr="4"
                            fontSize="16"
                            _groupHover={{
                                color: 'white',
                            }}
                            as={icon}
                        />
                    )}
                    {children}
                </Flex>
            </Box>
        </Link>
    )
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    const { getUser } = useContext(AuthContext);
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            {/* <Image src="/imagens/92969c3c-5d00-4121-a391-1c3d06d2f072.png" marginX="alto" height="50px" width="70px" alt='logo' /> */}

            <HStack spacing={{ base: '0', md: '6' }}>
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    name={getUser()?.name}
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{getUser()?.name}</Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            {/* <MenuItem>Conta</MenuItem> */}
                            <Link href="/logout">
                                <MenuItem color="red" icon={<RxExit />}>Sair</MenuItem>
                            </Link>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    )
}

export default function AppLayout({ children }: any) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <NextNProgress
                options={{
                    parent: "#content-container",
                    showSpinner: false
                }}
            />
            <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4" id="content-container">
                <Box bg="white" rounded="md" shadow="md" padding="4">
                    {children}
                </Box>

            </Box>
        </Box>
    )
}
