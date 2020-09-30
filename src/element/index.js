import {
    Button,
    Input,
    Form,
    FormItem,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Col,
    Row,
    Table,
    TableColumn,
    Switch,
    Pagination,
    Dialog,
    Select,
    Option,
    Tree,
    Tag,
    Alert,
    Step,
    Steps,
    Tabs,
    TabPane,
    Cascader,
    Checkbox,
    Upload

} from 'element-ui'

const element={
    install:function(Vue){
        Vue.use(Upload)
        Vue.use(Checkbox)
        Vue.use(Cascader)
        Vue.use(TabPane)
        Vue.use(Tabs)
        Vue.use(Step)
        Vue.use(Steps)
        Vue.use(Button),
        Vue.use(Input),
        Vue.use(Form),
        Vue.use(FormItem)
        Vue.use(Container)
        Vue.use(Header)
        Vue.use(Aside)
        Vue.use(Main)
        Vue.use(Menu)
        Vue.use(Submenu)
        Vue.use(MenuItem)
        Vue.use(Breadcrumb)
        Vue.use(BreadcrumbItem)
        Vue.use(Card)
        Vue.use(Row)
        Vue.use(Col)
        Vue.use(Table)
        Vue.use(TableColumn)
        Vue.use(Switch)
        Vue.use(Pagination)
        Vue.use(Dialog)
        Vue.use(Select)
        Vue.use(Option)
        Vue.use(Tree)
        Vue.use(Tag)
        Vue.use(Alert)
    }
}

export default element