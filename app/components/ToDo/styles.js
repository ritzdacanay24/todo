import { createGlobalStyle } from 'styled-components';

const ToDoStyles = createGlobalStyle`
html,
body {
	height: 100%;
	width: 100%;
	line-height: 1.5;
}

body {
	font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

body.fontLoaded {
	font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

#app {
	background-color: #fafafa;
	min-height: 100%;
	min-width: 100%;
}

p,
label {
	font-family: Georgia, Times, 'Times New Roman', serif;
	line-height: 1.5em;
}

.list-style-none {
	list-style: none;
	padding: 0;
	margin: 0
}

//remove padding on mobile devices
// [class*="col-"] {
//     padding-left: 0 !important;
//     padding-right: 0 !important;
// }
// .container {
//   padding:0px !important
// }
// .row {
//   margin-right:0 !important
//   margin-left:0 !important
// }
.no-padding {
	padding: 0px !important
}

.padding-top-10 {
	padding-top: 10px !important
}

.padding-bottom-10 {
	padding-bottom: 10px !important
}

body .App {
	background-repeat: no-repeat;
	background-attachment: fixed;
	background-position: center;
	background-size: cover;
	/* Resize the background image to cover the entire container */
	background-image: url(https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590_960_720.jpg)
}

//.card { background-color: rgba(245, 245, 245, 0.9) !important; }
//.card.card-header, .card.card-footer { background-color: rgba(245, 245, 245, 0.4) !important;}
.card-header {
	padding: .75rem 1.25rem;
	margin-bottom: 0;
	background-color: rgba(245, 245, 245, 0.9) !important;
	border-bottom: 1px solid rgba(0, 0, 0, 0.5);
}

.container {
	padding: 5px
}

.active {
	background-color: #ffa931 !important border:#ffa931 !important
}

.btn-orange {
	background-color: #ffa931 !important border:#ffa931 !important;
	color: white !important
}

.btn-orange:hover {
	background-color: #D5A021;
	border-color: #D5A021;
}

.btn-orange:active,
.btn-orange:focus {
	color: #fff;
	background-color: #ffa931 !important;
	border-color: #ffa931 !important;
	box-shadow: 0 0 0 0.2rem rgba(213, 160, 33, 0.5) !important;
}

a {
	color: #ffa931 !important
}

a.nav-link.active {
	color: white !important
}

textarea:focus,
input[type="text"]:focus,
input[type="password"]:focus,
input[type="datetime"]:focus,
input[type="datetime-local"]:focus,
input[type="date"]:focus,
input[type="month"]:focus,
input[type="time"]:focus,
input[type="week"]:focus,
input[type="number"]:focus,
input[type="email"]:focus,
input[type="url"]:focus,
input[type="search"]:focus,
input[type="tel"]:focus,
input[type="color"]:focus,
input[type="color"]:focus,
select.form-control:focus,
.uneditable-input:focus {
	border-color: rgba(255, 169, 49, 0.8);
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(255, 169, 49, 0.6);
	outline: 0 none;
}

nav.navbar {
	background-color: rgba(0, 0, 0, 0.8) !important;
}

.table td.vertical-align-middle {
	vertical-align: middle;
}

.vertical-align-middle {
	vertical-align: middle;
}


/* The container */

.custom-checkbox {
	display: block;
	position: relative;
	padding-left: 35px;
	margin-bottom: 12px;
	cursor: pointer;
	font-size: 22px;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}


/* Hide the browser's default checkbox */

.custom-checkbox input {
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
}


/* Create a custom checkbox */

.checkmark {
	position: absolute;
	top: -8px;
	left: 5px;
	height: 25px;
	width: 25px;
	background-color: #ccc;
}


/* On mouse-over, add a grey background color */

.custom-checkbox:hover input~.checkmark {
	background-color: #bbb;
}


/* When the checkbox is checked, add a blue background */

.custom-checkbox input:checked~.checkmark {
	background-color: #ffa931 !important;
}


/* Create the checkmark/indicator (hidden when not checked) */

.checkmark:after {
	content: "";
	position: absolute;
	display: none;
}


/* Show the checkmark when checked */

.custom-checkbox input:checked~.checkmark:after {
	display: block;
}


/* Style the checkmark/indicator */

.custom-checkbox .checkmark:after {
	left: 10px;
	top: 7px;
	width: 5px;
	height: 10px;
	border: solid white;
	border-width: 0 3px 3px 0;
	-webkit-transform: rotate(45deg);
	-ms-transform: rotate(45deg);
	transform: rotate(45deg);
}

.card {
	border: 1px solid #e5e5e5 !important;
	border-radius: 0 !important;
}

.no-border {
	border: unset !important;
	border-radius: 0 !important;
}

.light-shadow {
	border-bottom: 0 none;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.46);
}

.bottom-shadow {
	-webkit-box-shadow: 0 5px 6px -6px #777;
	-moz-box-shadow: 0 10px 6px -6px #777;
	box-shadow: 0 5px 6px -6px #777;
}

.pointer {
	cursor: pointer
}

.sticky-top {
	top: 80px !important;
	width: 100% !important;
}

.sticky-top.sticky-top-card {
	top: 118px !important;
	width: 100% !important;
}

.sticky-top.sticky-top-card-header {
	top: 57px !important;
	width: 100% !important;
}

sticky-top-card-item {
	top: 129px !important;
}


/* Hide scrollbar for Chrome, Safari and Opera */

.hideScroll::-webkit-scrollbar {
	display: none;
}


/* Hide scrollbar for IE, Edge and Firefox */

.hideScroll {
	-ms-overflow-style: none;
	/* IE and Edge */
	scrollbar-width: none;
	/* Firefox */
}

.text-orange {
	color: #ffa931 !important
}

.card .card-body {
	background: url(/containers/ToDo/groceryTodo.png) no-repeat;
	background-position: center;
	background-size: cover;
}

.card-header-side {
	padding: .55rem 1.25rem;
	margin-bottom: 0;
	background-color: white !important;
	border-bottom: 1px solid rgba(0, 0, 0, -11.875) !important;
}

.react-confirm-alert-overlay {
	z-index: 9999 !important;
}

.custom-ui {
	text-align: center;
	width: 500px;
	padding: 40px;
	background: #28bae6;
	box-shadow: 0 20px 75px rgba(0, 0, 0, 0.23);
	color: #fff;
}

.custom-ui>h1 {
	margin-top: 0;
}

.custom-ui>button {
	width: 160px;
	padding: 10px;
	border: 1px solid #fff;
	margin: 10px;
	cursor: pointer;
	background: none;
	color: #fff;
	font-size: 14px;
}

@media (min-width: 1200px) {
	.container {
		max-width: 1400px !important;
	}
}

.shadow-1 {
	-webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	-moz-box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.shadow {
	-webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	-moz-box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

ul.dropdown-menu {
	background-color: #00AEFE;
}

ul.dropdown-menu:hover {
	background-color: #00AEFE;
}

//ITEM TABLE
.todo-table-items .line-through {
	text-decoration: line-through;
	color: red !important
}

.todo-table-items tr td {
	vertical-align: middle;
}

td.line-through {
	color: red !important
}

.table td.line-through span {
	color: black !important
}

.todo-table-items .width-35 {
	width: 35px !important
}

.todo-table-items .padding-left-25 {
	padding-left: 25px !important
}

.todo-table-items .padding-left-10 {
	padding-left: 10px !important
}

.todo-table-items thead.todo-table-thead tr:first-child {
	border-left-style: solid;
	border-left-color: orange;
	border-width: 5px;
}

.todo-table-items .font-size-20 {
	font-size: 20px !important
}

.todo-table-items .small-smaller {
	font-size: 11px !important
}

.todo-table-items .image {
	max-height: 40px;
	min-width: 40px;
}

.position-relative {
	position: relative;
}

div.nav-app {
	padding: 10px !important;
}

div.nav-app ul.nav {
	flex-wrap: unset !important;
	white-space: nowrap !important;
	overflow: auto !important;
}

.card.todo-side-nav>div img {
	width: 180px;
	margin: 0 auto;
	display: block;
}

.card.todo-side-nav .side-body {
	overflow: auto;
	max-height: 500px;
}

.card.sticky-top.sticky-top-item-search {
	top: 185px !important;
}

.sticky-top.sticky-top-list {
	top: 0 !important;
}

.invite {
	min-height: 400px !important;
	max-height: 400px !important;
	min-width: 300px
}

@media only screen and (max-width: 600px) {
	span.text-overflow {
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 200px;
		display: block;
		overflow: hidden
	}
}

.line-through {
	opacity: 0.6
}

.line-through-opacity {
	opacity: 0.5
}
`;

export default ToDoStyles;
