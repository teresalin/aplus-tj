import React from 'react';
import { AppProps } from 'next/app';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Drawer from '@material-ui/core/Drawer';
import Head from 'next/head';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';

import fetcher from "../utils/fetcher";

import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import SelectedListItem from '../src/components/SelectedListItem';

declare global {
	interface Window {
		ace?: any;
	}
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		display: "flex",
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: '#e85a4b',
	},
	title: {
		flexGrow: 1,
		lineHeight: 'normal',
	},
	orange: {
		backgroundColor: "orange",
	},
	drawer: {
		width: 250,
		flexShrink: 0,
	},
	drawerPaper: {
		width: 250,
		backgroundColor: '#eff8fa',
	},
	drawerContainer: {
		overflow: 'auto',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	pointer: {
		cursor: 'pointer',
	},
	logo: {
		maxWidth: 30,
		marginRight: theme.spacing(1),
	},
}));

// function getGoogleUser(): {id: string, email: string} | null {
//   if (process.env.NODE_ENV === 'development') {
//     return {
//       id: '1',
//       email: 'test@curavitclinicalresearch.com',
//     };
//   }
//   const { data } = useSWR('/api/email', fetcher);
//   return data;
// }

function MyApp({ Component, pageProps }: AppProps) {
	const [hasMounted, setHasMounted] = React.useState(false);
	const classes = useStyles();

	//   let googleUser = getGoogleUser();
	//   if (googleUser) {
	//     googleUser.email = googleUser.email ? googleUser.email.replace('accounts.google.com:', '') : '';
	//     googleUser.id = googleUser.id ? googleUser.id.replace('accounts.google.com:', '') : '';
	//   }

	//   const { data } = useSWR(googleUser ? `/api/logged-in-user?email=${googleUser.email}` : null, fetcher);
	//   const user = data || null;
	//   if (user && !user.google_id) {
	//     fetch("/api/users/" + user.id, {
	//       method: 'POST', 
	//       headers: {
	//         Accept: 'application/json',
	//         'Content-Type': 'application/json',
	//       },
	//       body: JSON.stringify({ google_id: googleUser.id, username: user.username, email: user.email })
	//     })
	//   }

	React.useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) {
		return null;
	}

	// HACK the classnames don't work on the first render on the outer element
	// for some reason. This answer may help fix properly
	//
	return <div><div className={classes.root}>
		<Head>
			<title>A Plus</title>
			<link rel="icon" type="image/x-icon" href="/favicon.ico?" />
			<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.13/ace.js" integrity="sha512-OMjy8oWtPbx9rJmoprdaQdS2rRovgTetHjiBf7RL7LvRSouoMLks5aIcgqHb6vGEAduuPdBTDCoztxLR+nv45g==" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>
		</Head>
		<AppBar className={classes.appBar} position="fixed">
			<Toolbar>
				<img src="/logo2.png" alt="A Plus" className={classes.logo} />
				<Typography variant="h6" className={classes.title}>
					<Link href="/">
						A Plus
					</Link>
				</Typography>
			</Toolbar>
		</AppBar>
		<Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }}>
			<Toolbar />
			<SelectedListItem />
		</Drawer>
		<main className={classes.content}>
			<Toolbar />
			{/* <Component {...pageProps} /> */}
		</main>
	</div></div>
}

export default MyApp
