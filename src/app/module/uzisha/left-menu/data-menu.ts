import { Menu } from "src/app/interfaces/menu";

export let menu: Menu[]= [];

export const submenu :Menu[]=[
  {router:'/uzisha/tables',title:'tables',imgSrc:'',icon:'barbell-outline',avatar_class:''},
  {router:'/uzisha/servants',title:'serveurs',imgSrc:'',icon:'people-outline',avatar_class:''},
  {router:'/uzisha/orders',title:'commandes',imgSrc:'',icon:'beaker-outline',avatar_class:''},
  {router:'/uzisha/finances/invoices',title:'factures',imgSrc:'',icon:'cart',avatar_class:''},
  {router:'/uzisha/finances/expenditures',title:'depenses',imgSrc:'',icon:'cash',avatar_class:''},
  {router:'/uzisha/othersentries',title:'Entrée argent',imgSrc:'',icon:'add',avatar_class:''},
  {router:'/uzisha/finances/fences',title:'clôtures',imgSrc:'',icon:'exit-outline',avatar_class:''},
  {router:'/uzisha/accounts',title:'comptes',imgSrc:'',icon:'reorder-four-outline',avatar_class:''},
  {router:'/uzisha/providers',title:'fournisseurs',imgSrc:'',icon:'people',avatar_class:''},
  {router:'/uzisha/generalreport',title:'Marge brute',imgSrc:'',icon:'document',avatar_class:''},
  {router:'/uzisha/pointofsales',title:'POS',imgSrc:'',icon:'location-outline',avatar_class:''},
];
