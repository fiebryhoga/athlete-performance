import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { A as AppLayout } from "./AppLayout-rxyXD7Jy.js";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { Flame, ChevronLeft, Plus, Info, Target, Trash2, Activity, Save, CheckCircle2, RefreshCw, Droplets } from "lucide-react";
import { P as PageHeader } from "./PageHeader-Dbzk0fkj.js";
import { M as Modal } from "./Modal-DUGk5ZHw.js";
import "axios";
import "@headlessui/react";
const INDONESIAN_FOODS = {
  carbs: [
    { name: "Nasi Putih", portion: "100g", protein: 2.7, carbs: 28, fats: 0.3, cals: 130 },
    { name: "Nasi Merah", portion: "100g", protein: 2.6, carbs: 23, fats: 0.9, cals: 110 },
    { name: "Nasi Jagung", portion: "100g", protein: 3, carbs: 32, fats: 1, cals: 150 },
    { name: "Nasi Uduk", portion: "100g", protein: 3, carbs: 30, fats: 4, cals: 165 },
    { name: "Nasi Goreng", portion: "100g", protein: 5, carbs: 25, fats: 8, cals: 190 },
    { name: "Nasi Kuning", portion: "150g", protein: 4, carbs: 40, fats: 2, cals: 200 },
    { name: "Nasi Bakar", portion: "150g", protein: 5, carbs: 42, fats: 6, cals: 250 },
    { name: "Nasi Liwet", portion: "150g", protein: 4, carbs: 40, fats: 4, cals: 220 },
    { name: "Nasi Shirataki", portion: "150g", protein: 0.1, carbs: 3, fats: 0.1, cals: 15 },
    { name: "Lontong / Ketupat", portion: "100g", protein: 2.5, carbs: 31, fats: 0.2, cals: 140 },
    { name: "Bubur Ayam (Tanpa Kuah)", portion: "200g", protein: 5, carbs: 36, fats: 2, cals: 180 },
    { name: "Kentang Rebus", portion: "100g", protein: 1.9, carbs: 20, fats: 0.1, cals: 87 },
    { name: "Kentang Goreng", portion: "100g", protein: 3, carbs: 41, fats: 15, cals: 312 },
    { name: "Mashed Potato (Kentang Tumbuk)", portion: "150g", protein: 3, carbs: 20, fats: 4, cals: 130 },
    { name: "Ubi Jalar Rebus", portion: "100g", protein: 1.6, carbs: 20, fats: 0.1, cals: 86 },
    { name: "Singkong Rebus", portion: "100g", protein: 1.4, carbs: 38, fats: 0.3, cals: 160 },
    { name: "Talas Rebus", portion: "100g", protein: 1.5, carbs: 26, fats: 0.2, cals: 112 },
    { name: "Oatmeal (Mentah)", portion: "40g", protein: 5.3, carbs: 27, fats: 2.6, cals: 155 },
    { name: "Roti Gandum", portion: "2 lembar (60g)", protein: 7, carbs: 26, fats: 2, cals: 150 },
    { name: "Roti Putih", portion: "2 lembar (60g)", protein: 5, carbs: 30, fats: 2, cals: 160 },
    { name: "Roti Tawar Gandum Panggang", portion: "60g", protein: 7, carbs: 26, fats: 2, cals: 150 },
    { name: "Mie Telur (Rebus)", portion: "100g", protein: 4.5, carbs: 25, fats: 1.2, cals: 138 },
    { name: "Mie Goreng", portion: "100g", protein: 5, carbs: 32, fats: 12, cals: 250 },
    { name: "Bihun Goreng", portion: "100g", protein: 3, carbs: 40, fats: 8, cals: 240 },
    { name: "Bihun Jagung (Mentah)", portion: "50g", protein: 0.5, carbs: 40, fats: 0, cals: 175 },
    { name: "Kwetiau Goreng", portion: "100g", protein: 4, carbs: 35, fats: 10, cals: 245 },
    { name: "Misoa (Mentah)", portion: "50g", protein: 5, carbs: 37, fats: 1, cals: 178 },
    { name: "Soun Goreng", portion: "100g", protein: 2, carbs: 40, fats: 4, cals: 200 },
    { name: "Jagung Manis Rebus", portion: "100g", protein: 3.3, carbs: 19, fats: 1.4, cals: 86 },
    { name: "Makaroni Gandum", portion: "50g", protein: 6, carbs: 35, fats: 1, cals: 175 },
    { name: "Pasta Spaghetti (Rebus)", portion: "100g", protein: 5, carbs: 30, fats: 1, cals: 158 },
    { name: "Ketan Putih (Kukus)", portion: "100g", protein: 3, carbs: 38, fats: 1, cals: 180 },
    { name: "Ketan Hitam", portion: "100g", protein: 4, carbs: 40, fats: 1, cals: 190 },
    { name: "Perkedel Kentang", portion: "50g", protein: 3, carbs: 10, fats: 4, cals: 90 },
    { name: "Perkedel Jagung", portion: "50g", protein: 3, carbs: 12, fats: 5, cals: 100 }
  ],
  proteins: [
    { name: "Dada Ayam (Rebus/Panggang)", portion: "100g", protein: 31, carbs: 0, fats: 3.6, cals: 165 },
    { name: "Paha Ayam Tnp Kulit", portion: "100g", protein: 24, carbs: 0, fats: 8, cals: 177 },
    { name: "Ayam Goreng Paha", portion: "100g", protein: 22, carbs: 4, fats: 14, cals: 230 },
    { name: "Ayam Bakar Taliwang", portion: "100g", protein: 25, carbs: 2, fats: 8, cals: 180 },
    { name: "Ayam Pop", portion: "100g", protein: 26, carbs: 1, fats: 7, cals: 170 },
    { name: "Ayam Betutu", portion: "100g", protein: 25, carbs: 2, fats: 6, cals: 165 },
    { name: "Dada Ayam Filet Tepung (Katsu)", portion: "100g", protein: 20, carbs: 15, fats: 12, cals: 260 },
    { name: "Gulai Ayam", portion: "100g", protein: 20, carbs: 4, fats: 14, cals: 220 },
    { name: "Sate Ayam (Tanpa Bumbu Kacang)", portion: "5 tusuk (100g)", protein: 26, carbs: 2, fats: 6, cals: 170 },
    { name: "Sate Lilit Ayam", portion: "100g", protein: 20, carbs: 5, fats: 8, cals: 170 },
    { name: "Bebek Goreng", portion: "100g", protein: 18, carbs: 3, fats: 25, cals: 305 },
    { name: "Bebek Bakar", portion: "100g", protein: 20, carbs: 2, fats: 18, cals: 250 },
    { name: "Telur Ayam Rebus", portion: "1 butir (50g)", protein: 6, carbs: 0.6, fats: 5, cals: 78 },
    { name: "Telur Ceplok (Mata Sapi)", portion: "1 butir (50g)", protein: 6, carbs: 0.5, fats: 7, cals: 90 },
    { name: "Telur Dadar", portion: "1 butir (50g)", protein: 6, carbs: 1, fats: 8, cals: 95 },
    { name: "Putih Telur", portion: "1 butir (30g)", protein: 3.3, carbs: 0.2, fats: 0.1, cals: 15 },
    { name: "Telur Asin", portion: "1 butir (60g)", protein: 8, carbs: 1, fats: 9, cals: 120 },
    { name: "Telur Puyuh Rebus", portion: "5 butir (50g)", protein: 6, carbs: 0.2, fats: 5.5, cals: 80 },
    { name: "Telur Balado", portion: "1 butir (60g)", protein: 6, carbs: 3, fats: 8, cals: 110 },
    { name: "Telur Bumbu Rujak", portion: "1 butir (60g)", protein: 6, carbs: 4, fats: 7, cals: 105 },
    { name: "Telur Orak-Arik", portion: "60g", protein: 7, carbs: 1, fats: 10, cals: 120 },
    { name: "Telur Puyuh Balado", portion: "50g", protein: 6, carbs: 2, fats: 7, cals: 100 },
    { name: "Daging Sapi (Has Dalam/Tenderloin)", portion: "100g", protein: 26, carbs: 0, fats: 7, cals: 170 },
    { name: "Daging Sapi (Cincang)", portion: "100g", protein: 25, carbs: 0, fats: 15, cals: 240 },
    { name: "Rendang Sapi", portion: "100g", protein: 22, carbs: 10, fats: 25, cals: 350 },
    { name: "Sop Daging Sapi", portion: "150g", protein: 15, carbs: 5, fats: 7, cals: 150 },
    { name: "Empal Goreng", portion: "50g", protein: 15, carbs: 4, fats: 9, cals: 160 },
    { name: "Dendeng Balado", portion: "50g", protein: 14, carbs: 6, fats: 10, cals: 180 },
    { name: "Semur Daging Sapi", portion: "100g", protein: 16, carbs: 8, fats: 9, cals: 180 },
    { name: "Rawon Daging Sapi", portion: "150g", protein: 15, carbs: 5, fats: 10, cals: 170 },
    { name: "Sate Kambing", portion: "5 tusuk (100g)", protein: 24, carbs: 2, fats: 9, cals: 190 },
    { name: "Sate Padang", portion: "100g", protein: 18, carbs: 10, fats: 9, cals: 190 },
    { name: "Tongseng Kambing", portion: "150g", protein: 18, carbs: 6, fats: 14, cals: 220 },
    { name: "Gulai Kambing", portion: "150g", protein: 16, carbs: 5, fats: 16, cals: 240 },
    { name: "Ikan Nila Panggang", portion: "100g", protein: 26, carbs: 0, fats: 2.7, cals: 128 },
    { name: "Ikan Lele Bakar", portion: "100g", protein: 18, carbs: 0, fats: 2.9, cals: 105 },
    { name: "Ikan Lele Goreng", portion: "100g", protein: 16, carbs: 4, fats: 12, cals: 185 },
    { name: "Ikan Tuna", portion: "100g", protein: 28, carbs: 0, fats: 1, cals: 130 },
    { name: "Ikan Tongkol", portion: "100g", protein: 24, carbs: 0, fats: 1.5, cals: 110 },
    { name: "Ikan Kembung", portion: "100g", protein: 19, carbs: 0, fats: 4.5, cals: 120 },
    { name: "Ikan Gurame Bakar", portion: "100g", protein: 18, carbs: 0, fats: 3, cals: 115 },
    { name: "Ikan Patin", portion: "100g", protein: 16, carbs: 0, fats: 5, cals: 115 },
    { name: "Ikan Bandeng Bakar", portion: "100g", protein: 22, carbs: 0, fats: 8, cals: 160 },
    { name: "Ikan Bawal Bakar", portion: "100g", protein: 20, carbs: 0, fats: 6, cals: 140 },
    { name: "Ikan Dori Panggang", portion: "100g", protein: 20, carbs: 0, fats: 1, cals: 90 },
    { name: "Ikan Salmon Panggang", portion: "100g", protein: 22, carbs: 0, fats: 12, cals: 200 },
    { name: "Ikan Kakap Asam Manis", portion: "100g", protein: 18, carbs: 10, fats: 7, cals: 180 },
    { name: "Bandeng Presto", portion: "100g", protein: 20, carbs: 0, fats: 8, cals: 155 },
    { name: "Teri Medan Kering", portion: "50g", protein: 16, carbs: 0, fats: 3, cals: 95 },
    { name: "Udang Rebus", portion: "100g", protein: 24, carbs: 0.2, fats: 0.3, cals: 99 },
    { name: "Udang Balado", portion: "100g", protein: 20, carbs: 4, fats: 5, cals: 130 },
    { name: "Udang Goreng Mentega", portion: "100g", protein: 18, carbs: 2, fats: 12, cals: 190 },
    { name: "Cumi-cumi", portion: "100g", protein: 15.6, carbs: 3, fats: 1.4, cals: 92 },
    { name: "Cumi Saus Tiram", portion: "100g", protein: 16, carbs: 5, fats: 4, cals: 120 },
    { name: "Kerang Dara Rebus", portion: "100g", protein: 14, carbs: 4, fats: 1, cals: 80 },
    { name: "Tempe (Kukus/Panggang)", portion: "100g", protein: 19, carbs: 9, fats: 11, cals: 192 },
    { name: "Tempe Goreng", portion: "100g", protein: 17, carbs: 12, fats: 18, cals: 270 },
    { name: "Tempe Bacem", portion: "50g", protein: 8, carbs: 10, fats: 4, cals: 110 },
    { name: "Tempe Orek", portion: "50g", protein: 9, carbs: 12, fats: 6, cals: 130 },
    { name: "Tahu Putih (Kukus)", portion: "100g", protein: 8, carbs: 2, fats: 5, cals: 76 },
    { name: "Tahu Goreng", portion: "100g", protein: 7, carbs: 4, fats: 12, cals: 150 },
    { name: "Tahu Bacem", portion: "50g", protein: 5, carbs: 8, fats: 3, cals: 80 },
    { name: "Susu Protein / Whey", portion: "1 scoop (30g)", protein: 24, carbs: 3, fats: 1.5, cals: 120 },
    { name: "Susu Sapi Cair Full Cream", portion: "200ml", protein: 6, carbs: 10, fats: 7, cals: 122 },
    { name: "Susu Sapi Cair Low Fat", portion: "200ml", protein: 6, carbs: 11, fats: 2, cals: 85 },
    { name: "Yogurt Plain", portion: "100g", protein: 10, carbs: 4, fats: 0.4, cals: 59 }
  ],
  vegetables: [
    { name: "Bayam Rebus", portion: "100g", protein: 2.9, carbs: 3.6, fats: 0.4, cals: 23 },
    { name: "Bayam Bening", portion: "150g", protein: 2.5, carbs: 4, fats: 0.5, cals: 30 },
    { name: "Bening Bayam Jagung", portion: "150g", protein: 2, carbs: 8, fats: 0.5, cals: 45 },
    { name: "Kangkung Tumis Air", portion: "100g", protein: 2.6, carbs: 3.1, fats: 0.2, cals: 19 },
    { name: "Cah Kangkung Saus Tiram", portion: "100g", protein: 2.5, carbs: 5, fats: 3, cals: 55 },
    { name: "Plecing Kangkung", portion: "100g", protein: 2, carbs: 4, fats: 1, cals: 40 },
    { name: "Brokoli Kukus", portion: "100g", protein: 2.8, carbs: 7, fats: 0.4, cals: 34 },
    { name: "Kembang Kol Rebus", portion: "100g", protein: 2, carbs: 5, fats: 0.3, cals: 25 },
    { name: "Wortel Rebus", portion: "100g", protein: 0.9, carbs: 10, fats: 0.2, cals: 41 },
    { name: "Buncis Rebus", portion: "100g", protein: 1.8, carbs: 7, fats: 0.1, cals: 31 },
    { name: "Tumis Kacang Panjang", portion: "100g", protein: 2, carbs: 7, fats: 3, cals: 60 },
    { name: "Sawi Hijau", portion: "100g", protein: 1.5, carbs: 2.2, fats: 0.2, cals: 13 },
    { name: "Sawi Putih", portion: "100g", protein: 1.2, carbs: 3, fats: 0.2, cals: 16 },
    { name: "Tumis Sawi Putih Bakso", portion: "150g", protein: 5, carbs: 6, fats: 4, cals: 80 },
    { name: "Tumis Pakcoy Bawang Putih", portion: "100g", protein: 2, carbs: 4, fats: 1, cals: 35 },
    { name: "Tauge Rebus", portion: "100g", protein: 3, carbs: 6, fats: 0.2, cals: 30 },
    { name: "Tomat Segar", portion: "100g", protein: 0.9, carbs: 3.9, fats: 0.2, cals: 18 },
    { name: "Timun Segar", portion: "100g", protein: 0.6, carbs: 3.6, fats: 0.1, cals: 15 },
    { name: "Kubis / Kol Rebus", portion: "100g", protein: 1.3, carbs: 5.8, fats: 0.1, cals: 25 },
    { name: "Daun Singkong Rebus", portion: "100g", protein: 6.8, carbs: 13, fats: 1.2, cals: 73 },
    { name: "Tumis Daun Singkong", portion: "100g", protein: 4, carbs: 8, fats: 2, cals: 60 },
    { name: "Gulai Daun Singkong", portion: "150g", protein: 5, carbs: 10, fats: 8, cals: 130 },
    { name: "Daun Pepaya Rebus", portion: "100g", protein: 8, carbs: 11, fats: 2, cals: 79 },
    { name: "Tumis Bunga Pepaya", portion: "100g", protein: 2, carbs: 6, fats: 2, cals: 50 },
    { name: "Pare Rebus", portion: "100g", protein: 1, carbs: 4, fats: 0.2, cals: 17 },
    { name: "Tumis Pare Belut", portion: "100g", protein: 2, carbs: 5, fats: 2.5, cals: 50 },
    { name: "Oyong Rebus", portion: "100g", protein: 1, carbs: 4, fats: 0.2, cals: 19 },
    { name: "Sop Oyong Sohun", portion: "150g", protein: 2, carbs: 10, fats: 1, cals: 60 },
    { name: "Labu Siam Kukus", portion: "100g", protein: 0.6, carbs: 4, fats: 0.1, cals: 16 },
    { name: "Terong Balado (sedikit minyak)", portion: "100g", protein: 1, carbs: 6, fats: 3, cals: 60 },
    { name: "Sayur Sop (Wortel, Buncis, Kol)", portion: "150g", protein: 2, carbs: 9, fats: 1, cals: 50 },
    { name: "Sop Kimlo", portion: "150g", protein: 6, carbs: 10, fats: 3, cals: 90 },
    { name: "Sayur Asem", portion: "150g", protein: 2, carbs: 12, fats: 1.5, cals: 65 },
    { name: "Sayur Lodeh", portion: "150g", protein: 3, carbs: 10, fats: 6, cals: 100 },
    { name: "Sayur Nangka Muda (Gulai)", portion: "150g", protein: 3, carbs: 12, fats: 7, cals: 120 },
    { name: "Sayur Rebung", portion: "100g", protein: 2, carbs: 6, fats: 1, cals: 40 },
    { name: "Capcay Kuah", portion: "150g", protein: 4, carbs: 12, fats: 3, cals: 85 },
    { name: "Gado-gado (Bumbu dipisah)", portion: "200g", protein: 8, carbs: 25, fats: 12, cals: 230 },
    { name: "Pecel Sayur", portion: "150g", protein: 7, carbs: 20, fats: 10, cals: 190 },
    { name: "Karedok", portion: "150g", protein: 5, carbs: 15, fats: 6, cals: 120 },
    { name: "Urap Sayur", portion: "100g", protein: 3, carbs: 8, fats: 4, cals: 80 },
    { name: "Trancam", portion: "100g", protein: 3, carbs: 8, fats: 3, cals: 70 },
    { name: "Asinan Sayur", portion: "150g", protein: 4, carbs: 18, fats: 1, cals: 90 },
    { name: "Acar Kuning", portion: "100g", protein: 1, carbs: 8, fats: 3, cals: 60 },
    { name: "Tumis Genjer", portion: "100g", protein: 2, carbs: 5, fats: 2, cals: 45 },
    { name: "Tumis Jamur Kancing", portion: "100g", protein: 3, carbs: 5, fats: 1, cals: 40 },
    { name: "Tumis Jamur Kuping", portion: "100g", protein: 2, carbs: 4, fats: 1, cals: 35 }
  ],
  fruits_snacks: [
    { name: "Pisang Ambon", portion: "1 buah (100g)", protein: 1.1, carbs: 23, fats: 0.3, cals: 89 },
    { name: "Pisang Sunpride / Cavendish", portion: "1 buah (120g)", protein: 1.3, carbs: 27, fats: 0.4, cals: 105 },
    { name: "Pepaya", portion: "100g", protein: 0.5, carbs: 11, fats: 0.1, cals: 43 },
    { name: "Semangka", portion: "100g", protein: 0.6, carbs: 8, fats: 0.2, cals: 30 },
    { name: "Melon", portion: "100g", protein: 0.8, carbs: 8, fats: 0.2, cals: 34 },
    { name: "Apel", portion: "1 buah (150g)", protein: 0.4, carbs: 21, fats: 0.3, cals: 78 },
    { name: "Jeruk Manis", portion: "1 buah (130g)", protein: 1.2, carbs: 15, fats: 0.2, cals: 62 },
    { name: "Alpukat", portion: "100g", protein: 2, carbs: 9, fats: 15, cals: 160 },
    { name: "Mangga Harumanis", portion: "100g", protein: 0.8, carbs: 15, fats: 0.4, cals: 60 },
    { name: "Jambu Biji", portion: "100g", protein: 2.6, carbs: 14, fats: 1, cals: 68 },
    { name: "Jambu Air", portion: "100g", protein: 0.6, carbs: 10, fats: 0.2, cals: 46 },
    { name: "Nanas", portion: "100g", protein: 0.5, carbs: 13, fats: 0.1, cals: 50 },
    { name: "Manggis", portion: "100g", protein: 0.6, carbs: 18, fats: 0.6, cals: 73 },
    { name: "Rambutan", portion: "100g", protein: 0.9, carbs: 21, fats: 0.2, cals: 82 },
    { name: "Duku", portion: "100g", protein: 1, carbs: 16, fats: 0.2, cals: 70 },
    { name: "Salak", portion: "100g", protein: 0.4, carbs: 21, fats: 0.4, cals: 82 },
    { name: "Kelengkeng", portion: "100g", protein: 1.3, carbs: 15, fats: 0.1, cals: 60 },
    { name: "Bengkoang", portion: "100g", protein: 1.4, carbs: 13, fats: 0.2, cals: 55 },
    { name: "Buah Naga Merah", portion: "100g", protein: 1.2, carbs: 12, fats: 0.6, cals: 50 },
    { name: "Air Kelapa Muda", portion: "250ml", protein: 1, carbs: 10, fats: 0.5, cals: 45 },
    { name: "Daging Kelapa Muda", portion: "100g", protein: 1, carbs: 7, fats: 3, cals: 55 },
    { name: "Salad Buah", portion: "150g", protein: 2, carbs: 20, fats: 6, cals: 140 },
    { name: "Rujak Buah", portion: "150g", protein: 1, carbs: 25, fats: 1, cals: 110 },
    { name: "Asinan Buah", portion: "150g", protein: 1, carbs: 24, fats: 0.5, cals: 100 },
    { name: "Pudding Susu", portion: "100g", protein: 3, carbs: 20, fats: 3, cals: 120 },
    { name: "Pudding Coklat", portion: "100g", protein: 3, carbs: 22, fats: 3, cals: 130 },
    { name: "Kacang Tanah Sangrai", portion: "30g", protein: 7.7, carbs: 4.8, fats: 14, cals: 170 },
    { name: "Kacang Almond", portion: "20g", protein: 4.2, carbs: 4.3, fats: 10, cals: 115 },
    { name: "Kacang Mete Panggang", portion: "30g", protein: 5, carbs: 9, fats: 14, cals: 175 },
    { name: "Kacang Kenari", portion: "30g", protein: 4, carbs: 4, fats: 19, cals: 190 },
    { name: "Kuaci Bunga Matahari", portion: "30g", protein: 6, carbs: 6, fats: 14, cals: 170 },
    { name: "Kacang Hijau Rebus", portion: "100g", protein: 7, carbs: 19, fats: 0.4, cals: 105 },
    { name: "Bubur Kacang Hijau (Tanpa Santan)", portion: "150g", protein: 5, carbs: 25, fats: 1, cals: 130 },
    { name: "Sari Kacang Hijau", portion: "250ml", protein: 6, carbs: 28, fats: 1, cals: 150 },
    { name: "Susu Kedelai", portion: "250ml", protein: 8, carbs: 10, fats: 4, cals: 110 },
    { name: "Kacang Kedelai Goreng", portion: "30g", protein: 11, carbs: 9, fats: 6, cals: 140 },
    { name: "Edamame Rebus", portion: "100g", protein: 11, carbs: 9, fats: 5, cals: 121 },
    { name: "Kurma", portion: "3 butir (24g)", protein: 0.6, carbs: 18, fats: 0.1, cals: 66 },
    { name: "Jus Alpukat", portion: "250ml", protein: 2, carbs: 25, fats: 10, cals: 200 },
    { name: "Jus Jeruk", portion: "250ml", protein: 1, carbs: 26, fats: 0, cals: 110 },
    { name: "Jus Apel", portion: "250ml", protein: 0, carbs: 28, fats: 0, cals: 120 },
    { name: "Smoothie Pisang", portion: "250ml", protein: 5, carbs: 35, fats: 2, cals: 180 },
    { name: "Oatmeal Cookies", portion: "50g", protein: 4, carbs: 30, fats: 10, cals: 220 },
    { name: "Yogurt Buah", portion: "150g", protein: 5, carbs: 20, fats: 2, cals: 120 }
  ]
};
const FM = {};
for (const [, items] of Object.entries(INDONESIAN_FOODS)) {
  for (const f of items) FM[f.name] = f;
}
function gf(names) {
  return names.map((n) => FM[n]).filter(Boolean);
}
const DN = {
  "Gado-gado (Bumbu dipisah)": "Gado-gado",
  "Bubur Ayam (Tanpa Kuah)": "Bubur Ayam",
  "Dada Ayam (Rebus/Panggang)": "Dada Ayam Panggang",
  "Paha Ayam Tnp Kulit": "Paha Ayam",
  "Sate Ayam (Tanpa Bumbu Kacang)": "Sate Ayam",
  "Daging Sapi (Has Dalam/Tenderloin)": "Daging Sapi Tenderloin",
  "Daging Sapi (Cincang)": "Daging Sapi Cincang",
  "Tempe (Kukus/Panggang)": "Tempe Kukus",
  "Tahu Putih (Kukus)": "Tahu Kukus",
  "Oatmeal (Mentah)": "Oatmeal",
  "Mie Telur (Rebus)": "Mie Telur",
  "Pasta Spaghetti (Rebus)": "Pasta Spaghetti",
  "Bubur Kacang Hijau (Tanpa Santan)": "Bubur Kacang Hijau",
  "Terong Balado (sedikit minyak)": "Terong Balado",
  "Sayur Sop (Wortel, Buncis, Kol)": "Sayur Sop",
  "Pisang Sunpride / Cavendish": "Pisang Cavendish",
  "Susu Protein / Whey": "Whey Protein",
  "Susu Sapi Cair Full Cream": "Susu Full Cream",
  "Susu Sapi Cair Low Fat": "Susu Low Fat",
  "Cah Kangkung Saus Tiram": "Cah Kangkung",
  "Kubis / Kol Rebus": "Kol Rebus",
  "Lontong / Ketupat": "Lontong",
  "Telur Ceplok (Mata Sapi)": "Telur Ceplok",
  "Jagung Manis Rebus": "Jagung Manis",
  "Bihun Jagung (Mentah)": "Bihun Jagung",
  "Misoa (Mentah)": "Misoa",
  "Ikan Nila Panggang": "Ikan Nila Bakar",
  "Kacang Hijau Rebus": "Kacang Hijau",
  "Kacang Kedelai Goreng": "Kacang Kedelai",
  "Teri Medan Kering": "Teri Goreng",
  "Kerang Dara Rebus": "Kerang Rebus",
  "Makaroni Gandum": "Makaroni",
  "Telur Puyuh Rebus": "Telur Puyuh",
  "Mashed Potato (Kentang Tumbuk)": "Mashed Potato",
  "Roti Tawar Gandum Panggang": "Roti Gandum Panggang",
  "Dada Ayam Filet Tepung (Katsu)": "Chicken Katsu"
};
const NU = {
  // Carbs
  "Nasi Putih": { u: "porsi", g: 150 },
  "Nasi Merah": { u: "porsi", g: 150 },
  "Nasi Jagung": { u: "porsi", g: 150 },
  "Nasi Uduk": { u: "porsi", g: 150 },
  "Nasi Goreng": { u: "piring", g: 200 },
  "Lontong / Ketupat": { u: "potong", g: 100 },
  "Bubur Ayam (Tanpa Kuah)": { u: "mangkuk", g: 250 },
  "Kentang Rebus": { u: "buah", g: 150 },
  "Ubi Jalar Rebus": { u: "buah", g: 150 },
  "Singkong Rebus": { u: "potong", g: 100 },
  "Talas Rebus": { u: "potong", g: 100 },
  "Oatmeal (Mentah)": { u: "porsi", g: 40 },
  "Mie Telur (Rebus)": { u: "porsi", g: 150 },
  "Pasta Spaghetti (Rebus)": { u: "porsi", g: 150 },
  "Jagung Manis Rebus": { u: "tongkol", g: 150 },
  "Roti Gandum": { u: "lembar", g: 30 },
  "Roti Putih": { u: "lembar", g: 30 },
  "Bihun Jagung (Mentah)": { u: "porsi", g: 50 },
  "Misoa (Mentah)": { u: "porsi", g: 50 },
  "Makaroni Gandum": { u: "porsi", g: 50 },
  "Mie Goreng": { u: "piring", g: 200 },
  "Bihun Goreng": { u: "piring", g: 200 },
  "Kwetiau Goreng": { u: "piring", g: 200 },
  "Nasi Kuning": { u: "porsi", g: 150 },
  "Nasi Bakar": { u: "bungkus", g: 150 },
  "Nasi Liwet": { u: "porsi", g: 150 },
  "Nasi Shirataki": { u: "porsi", g: 150 },
  "Soun Goreng": { u: "piring", g: 100 },
  "Ketan Putih (Kukus)": { u: "porsi", g: 100 },
  "Ketan Hitam": { u: "porsi", g: 100 },
  "Roti Tawar Gandum Panggang": { u: "lembar", g: 30 },
  "Mashed Potato (Kentang Tumbuk)": { u: "porsi", g: 150 },
  "Perkedel Kentang": { u: "buah", g: 50 },
  "Perkedel Jagung": { u: "buah", g: 50 },
  // Proteins
  "Dada Ayam (Rebus/Panggang)": { u: "potong", g: 100 },
  "Paha Ayam Tnp Kulit": { u: "potong", g: 100 },
  "Ayam Goreng Paha": { u: "potong", g: 100 },
  "Bebek Goreng": { u: "potong", g: 100 },
  "Sate Ayam (Tanpa Bumbu Kacang)": { u: "tusuk", g: 20 },
  "Sate Kambing": { u: "tusuk", g: 20 },
  "Tempe (Kukus/Panggang)": { u: "potong", g: 50 },
  "Tempe Goreng": { u: "potong", g: 50 },
  "Tahu Putih (Kukus)": { u: "potong", g: 50 },
  "Tahu Goreng": { u: "potong", g: 50 },
  "Rendang Sapi": { u: "potong", g: 50 },
  "Daging Sapi (Has Dalam/Tenderloin)": { u: "potong", g: 100 },
  "Daging Sapi (Cincang)": { u: "porsi", g: 100 },
  "Ikan Nila Panggang": { u: "ekor", g: 150 },
  "Ikan Lele Bakar": { u: "ekor", g: 100 },
  "Ikan Lele Goreng": { u: "ekor", g: 100 },
  "Ikan Tuna": { u: "potong", g: 100 },
  "Ikan Tongkol": { u: "potong", g: 100 },
  "Ikan Kembung": { u: "ekor", g: 80 },
  "Ikan Gurame Bakar": { u: "ekor", g: 150 },
  "Ikan Patin": { u: "potong", g: 100 },
  "Bandeng Presto": { u: "ekor", g: 100 },
  "Udang Rebus": { u: "ekor", g: 15 },
  "Cumi-cumi": { u: "porsi", g: 100 },
  "Kerang Dara Rebus": { u: "porsi", g: 100 },
  "Teri Medan Kering": { u: "sdm", g: 15 },
  "Telur Ayam Rebus": { u: "butir", g: 50 },
  "Telur Ceplok (Mata Sapi)": { u: "butir", g: 50 },
  "Telur Dadar": { u: "butir", g: 50 },
  "Telur Asin": { u: "butir", g: 60 },
  "Telur Puyuh Rebus": { u: "butir", g: 10 },
  "Putih Telur": { u: "butir", g: 30 },
  "Ayam Bakar Taliwang": { u: "potong", g: 100 },
  "Ayam Pop": { u: "potong", g: 100 },
  "Ayam Betutu": { u: "potong", g: 100 },
  "Dada Ayam Filet Tepung (Katsu)": { u: "potong", g: 100 },
  "Gulai Ayam": { u: "potong", g: 100 },
  "Bebek Bakar": { u: "potong", g: 100 },
  "Telur Balado": { u: "butir", g: 60 },
  "Telur Bumbu Rujak": { u: "butir", g: 60 },
  "Telur Orak-Arik": { u: "porsi", g: 60 },
  "Telur Puyuh Balado": { u: "butir", g: 10 },
  "Ikan Bandeng Bakar": { u: "ekor", g: 100 },
  "Ikan Bawal Bakar": { u: "ekor", g: 100 },
  "Ikan Dori Panggang": { u: "potong", g: 100 },
  "Ikan Salmon Panggang": { u: "potong", g: 100 },
  "Ikan Kakap Asam Manis": { u: "potong", g: 100 },
  "Cumi Saus Tiram": { u: "porsi", g: 100 },
  "Udang Balado": { u: "porsi", g: 100 },
  "Udang Goreng Mentega": { u: "porsi", g: 100 },
  "Sate Lilit Ayam": { u: "tusuk", g: 20 },
  "Sate Padang": { u: "tusuk", g: 20 },
  "Sop Daging Sapi": { u: "mangkuk", g: 150 },
  "Empal Goreng": { u: "potong", g: 50 },
  "Dendeng Balado": { u: "potong", g: 50 },
  "Semur Daging Sapi": { u: "porsi", g: 100 },
  "Rawon Daging Sapi": { u: "mangkuk", g: 150 },
  "Tongseng Kambing": { u: "mangkuk", g: 150 },
  "Gulai Kambing": { u: "mangkuk", g: 150 },
  "Tempe Bacem": { u: "potong", g: 50 },
  "Tempe Orek": { u: "porsi", g: 50 },
  "Tahu Bacem": { u: "potong", g: 50 },
  // Veggies
  "Bayam Bening": { u: "mangkuk", g: 150 },
  "Sayur Sop (Wortel, Buncis, Kol)": { u: "mangkuk", g: 150 },
  "Sayur Asem": { u: "mangkuk", g: 150 },
  "Sayur Lodeh": { u: "mangkuk", g: 150 },
  "Capcay Kuah": { u: "porsi", g: 150 },
  "Gado-gado (Bumbu dipisah)": { u: "porsi", g: 200 },
  "Pecel Sayur": { u: "porsi", g: 150 },
  "Daun Singkong Rebus": { u: "mangkuk", g: 100 },
  "Daun Pepaya Rebus": { u: "mangkuk", g: 100 },
  "Pare Rebus": { u: "potong", g: 50 },
  "Oyong Rebus": { u: "mangkuk", g: 100 },
  "Tomat Segar": { u: "buah", g: 50 },
  "Timun Segar": { u: "buah", g: 100 },
  "Bening Bayam Jagung": { u: "mangkuk", g: 150 },
  "Plecing Kangkung": { u: "porsi", g: 100 },
  "Tumis Sawi Putih Bakso": { u: "porsi", g: 150 },
  "Tumis Pakcoy Bawang Putih": { u: "porsi", g: 100 },
  "Tumis Daun Singkong": { u: "porsi", g: 100 },
  "Gulai Daun Singkong": { u: "mangkuk", g: 150 },
  "Tumis Bunga Pepaya": { u: "porsi", g: 100 },
  "Tumis Pare Belut": { u: "porsi", g: 100 },
  "Sop Oyong Sohun": { u: "mangkuk", g: 150 },
  "Sop Kimlo": { u: "mangkuk", g: 150 },
  "Sayur Nangka Muda (Gulai)": { u: "mangkuk", g: 150 },
  "Sayur Rebung": { u: "mangkuk", g: 100 },
  "Karedok": { u: "porsi", g: 150 },
  "Urap Sayur": { u: "porsi", g: 100 },
  "Trancam": { u: "porsi", g: 100 },
  "Asinan Sayur": { u: "porsi", g: 150 },
  "Acar Kuning": { u: "porsi", g: 100 },
  "Tumis Genjer": { u: "porsi", g: 100 },
  "Tumis Jamur Kancing": { u: "porsi", g: 100 },
  "Tumis Jamur Kuping": { u: "porsi", g: 100 },
  // Others
  "Buah Naga Merah": { u: "buah", g: 300 },
  "Mangga Harumanis": { u: "buah", g: 250 },
  "Semangka": { u: "potong", g: 200 },
  "Melon": { u: "potong", g: 150 },
  "Pepaya": { u: "potong", g: 150 },
  "Alpukat": { u: "buah", g: 200 },
  "Nanas": { u: "potong", g: 100 },
  "Jambu Biji": { u: "buah", g: 150 },
  "Kacang Tanah Sangrai": { u: "genggam", g: 30 },
  "Kacang Almond": { u: "genggam", g: 20 },
  "Edamame Rebus": { u: "porsi", g: 100 },
  "Kurma": { u: "butir", g: 8 },
  "Bubur Kacang Hijau (Tanpa Santan)": { u: "mangkuk", g: 200 },
  "Yogurt Plain": { u: "porsi", g: 100 },
  "Salad Buah": { u: "porsi", g: 150 },
  "Rujak Buah": { u: "porsi", g: 150 },
  "Asinan Buah": { u: "porsi", g: 150 },
  "Pudding Susu": { u: "cup", g: 100 },
  "Pudding Coklat": { u: "cup", g: 100 },
  "Kacang Mete Panggang": { u: "genggam", g: 30 },
  "Kacang Kenari": { u: "genggam", g: 30 },
  "Kuaci Bunga Matahari": { u: "genggam", g: 30 },
  "Sari Kacang Hijau": { u: "gelas", g: 250 },
  "Susu Kedelai": { u: "gelas", g: 250 },
  "Jus Alpukat": { u: "gelas", g: 250 },
  "Jus Jeruk": { u: "gelas", g: 250 },
  "Jus Apel": { u: "gelas", g: 250 },
  "Smoothie Pisang": { u: "gelas", g: 250 },
  "Oatmeal Cookies": { u: "keping", g: 25 },
  "Yogurt Buah": { u: "porsi", g: 150 }
};
const CUT_X = /* @__PURE__ */ new Set([
  "Nasi Goreng",
  "Nasi Uduk",
  "Ayam Goreng Paha",
  "Bebek Goreng",
  "Tempe Goreng",
  "Tahu Goreng",
  "Kentang Goreng",
  "Mie Goreng",
  "Bihun Goreng",
  "Kwetiau Goreng",
  "Rendang Sapi",
  "Ikan Lele Goreng",
  "Telur Asin",
  "Telur Dadar",
  "Kacang Tanah Sangrai",
  "Alpukat",
  "Sayur Lodeh",
  "Gado-gado (Bumbu dipisah)",
  "Pecel Sayur",
  "Susu Sapi Cair Full Cream",
  "Nasi Kuning",
  "Nasi Liwet",
  "Nasi Bakar",
  "Dada Ayam Filet Tepung (Katsu)",
  "Gulai Ayam",
  "Bebek Bakar",
  "Telur Balado",
  "Ikan Salmon Panggang",
  "Udang Goreng Mentega",
  "Empal Goreng",
  "Tongseng Kambing",
  "Gulai Kambing",
  "Sayur Nangka Muda (Gulai)",
  "Gulai Daun Singkong",
  "Pudding Coklat",
  "Kacang Mete Panggang",
  "Kuaci Bunga Matahari",
  "Jus Alpukat",
  "Smoothie Pisang",
  "Oatmeal Cookies",
  "Rujak Buah",
  "Asinan Buah",
  "Salad Buah"
]);
function fg(names, goal) {
  if (goal !== "cutting") return names;
  const r = names.filter((n) => !CUT_X.has(n));
  return r.length > 0 ? r : names;
}
function sr(seed) {
  let t = seed + 1831565813 | 0;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function pk(arr, seed) {
  return !arr || !arr.length ? null : arr[Math.floor(sr(seed) * arr.length)];
}
function cl(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
function ebg(p) {
  const m1 = p.match(/\((\d+)g\)/);
  if (m1) return +m1[1];
  const m2 = p.match(/^(\d+)g$/);
  if (m2) return +m2[1];
  const m3 = p.match(/(\d+)ml/);
  if (m3) return +m3[1];
  const m4 = p.match(/(\d+)g/);
  if (m4) return +m4[1];
  return 100;
}
function fp(food, scale) {
  const tg = Math.round(ebg(food.portion) * scale);
  const eu = food.portion.match(/^([\d.]+)\s*(buah|lembar|butir|tusuk|scoop|ekor|tongkol|sdm|bungkus|cup|keping|gelas)/i);
  if (eu) return fc(parseFloat(eu[1]) * scale, eu[2], tg);
  const n = NU[food.name];
  if (n) return fc(tg / n.g, n.u, tg);
  if (food.portion.includes("ml")) return `± ${tg}ml`;
  return `± ${tg}g`;
}
function fc(count, unit, grams) {
  const isDiscrete = /buah|butir|ekor|lembar|tongkol|tusuk|scoop|sdm|bungkus|cup|keping|gelas/i.test(unit);
  let step = 0.25;
  if (isDiscrete) {
    if (count >= 2.75) step = 1;
    else step = 0.5;
  } else {
    if (count >= 4.75) step = 1;
    else if (count >= 2.75) step = 0.5;
    else step = 0.25;
  }
  let r = Math.round(count / step) * step;
  if (r <= 0) r = isDiscrete ? 0.5 : 0.25;
  const exactGrams = Math.round(grams / count * r);
  let s;
  if (r === 0.25) s = "¼";
  else if (r === 0.5) s = "½";
  else if (r === 0.75) s = "¾";
  else if (r % 1 === 0.25) s = `${Math.floor(r)}¼`;
  else if (r % 1 === 0.5) s = `${Math.floor(r)}½`;
  else if (r % 1 === 0.75) s = `${Math.floor(r)}¾`;
  else s = `${Math.round(r)}`;
  return `± ${s} ${unit} (${exactGrams}g)`;
}
function getMR(split) {
  if (split === "Lower Carb") return { p: 0.4, f: 0.4, c: 0.2 };
  if (split === "Higher Carb") return { p: 0.3, f: 0.2, c: 0.5 };
  return { p: 0.3, f: 0.35, c: 0.35 };
}
function mi(food, scale) {
  const s = cl(scale, 0.25, 3.5);
  return {
    name: food.name,
    displayName: DN[food.name] || food.name,
    scaledPortion: fp(food, s),
    scale: Math.round(s * 100) / 100,
    protein: Math.round(food.protein * s * 10) / 10,
    carbs: Math.round(food.carbs * s * 10) / 10,
    fats: Math.round(food.fats * s * 10) / 10,
    calories: Math.round(food.cals * s)
  };
}
function si(items) {
  return items.reduce((a, i) => ({ protein: a.protein + i.protein, carbs: a.carbs + i.carbs, fats: a.fats + i.fats, calories: a.calories + i.calories }), { protein: 0, carbs: 0, fats: 0, calories: 0 });
}
function balanceMealMacros(items, targets) {
  const foods = items.map((i) => FM[i.name]);
  let scales = items.map((i) => Math.max(0.25, Math.min(3.5, i.scale || 1)));
  function getLoss(s) {
    let p = 0, c = 0, f = 0;
    for (let i = 0; i < foods.length; i++) {
      if (!foods[i]) continue;
      p += foods[i].protein * s[i];
      c += foods[i].carbs * s[i];
      f += foods[i].fats * s[i];
    }
    const dP = p - targets.protein;
    const dC = c - targets.carbs;
    const dF = f - targets.fats;
    return dP * dP * 1 + dC * dC * 1.5 + dF * dF * 0.2;
  }
  const stepSizes = [0.5, 0.1, 0.05];
  for (const step of stepSizes) {
    let improved = true;
    let iter = 0;
    while (improved && iter < 100) {
      improved = false;
      iter++;
      for (let i = 0; i < scales.length; i++) {
        if (!foods[i]) continue;
        let currentLoss = getLoss(scales);
        scales[i] += step;
        if (scales[i] <= 3.5 && getLoss(scales) < currentLoss) {
          currentLoss = getLoss(scales);
          improved = true;
        } else scales[i] -= step;
        scales[i] -= step;
        if (scales[i] >= 0.25 && getLoss(scales) < currentLoss) {
          currentLoss = getLoss(scales);
          improved = true;
        } else scales[i] += step;
      }
    }
  }
  items = items.map((item, i) => {
    const food = foods[i];
    return food ? mi(food, scales[i]) : item;
  });
  let finalCals = si(items).calories;
  if (finalCals > 0) {
    const ratioCal = targets.calories * 0.99 / finalCals;
    if (Math.abs(ratioCal - 1) > 0.02) {
      items = items.map((item) => {
        const food = FM[item.name];
        return food ? mi(food, cl(item.scale * ratioCal, 0.25, 3.5)) : item;
      });
    }
  }
  let checkCals = si(items).calories;
  if (checkCals > targets.calories) {
    const factor = targets.calories / checkCals;
    items = items.map((item) => {
      const food = FM[item.name];
      return food ? mi(food, item.scale * factor) : item;
    });
  }
  return items;
}
const MEAL_SLOTS = [
  { time: "07:00", type: "Sarapan", pct: 0.25, gen: "breakfast" },
  { time: "10:00", type: "Camilan Pagi", pct: 0.1, gen: "snack" },
  { time: "13:00", type: "Makan Siang", pct: 0.3, gen: "lunch" },
  { time: "16:00", type: "Camilan Sore", pct: 0.1, gen: "snack" },
  { time: "19:30", type: "Makan Malam", pct: 0.25, gen: "dinner" }
];
const BREAKFAST = {
  carbs: ["Nasi Putih", "Nasi Uduk", "Nasi Goreng", "Bubur Ayam (Tanpa Kuah)", "Roti Gandum", "Roti Putih", "Roti Tawar Gandum Panggang", "Oatmeal (Mentah)", "Lontong / Ketupat", "Ubi Jalar Rebus", "Singkong Rebus", "Kentang Rebus", "Mashed Potato (Kentang Tumbuk)", "Talas Rebus", "Mie Goreng", "Bihun Goreng", "Nasi Kuning", "Ketan Putih (Kukus)"],
  defaultProteins: ["Telur Ayam Rebus", "Telur Ceplok (Mata Sapi)", "Telur Dadar", "Telur Asin", "Telur Puyuh Rebus", "Putih Telur", "Tempe (Kukus/Panggang)", "Tempe Goreng", "Tahu Putih (Kukus)", "Tahu Goreng", "Telur Balado", "Telur Bumbu Rujak", "Telur Orak-Arik"],
  defaultSides: ["Pisang Ambon", "Pisang Sunpride / Cavendish", "Apel", "Jeruk Manis", "Pepaya", "Mangga Harumanis", "Semangka", "Melon", "Timun Segar", "Tomat Segar"]
};
const LUNCH = {
  carbs: ["Nasi Putih", "Nasi Merah", "Nasi Jagung", "Nasi Goreng", "Nasi Uduk", "Mie Telur (Rebus)", "Mie Goreng", "Bihun Goreng", "Kwetiau Goreng", "Bihun Jagung (Mentah)", "Misoa (Mentah)", "Soun Goreng", "Pasta Spaghetti (Rebus)", "Makaroni Gandum", "Kentang Rebus", "Lontong / Ketupat", "Ubi Jalar Rebus", "Singkong Rebus", "Jagung Manis Rebus", "Nasi Kuning", "Nasi Bakar", "Nasi Liwet", "Nasi Shirataki", "Ketan Hitam", "Mashed Potato (Kentang Tumbuk)", "Perkedel Kentang", "Perkedel Jagung"],
  defaultProteins: ["Dada Ayam (Rebus/Panggang)", "Paha Ayam Tnp Kulit", "Ayam Goreng Paha", "Bebek Goreng", "Ayam Bakar Taliwang", "Ayam Pop", "Ayam Betutu", "Dada Ayam Filet Tepung (Katsu)", "Gulai Ayam", "Bebek Bakar", "Ikan Nila Panggang", "Ikan Lele Bakar", "Ikan Lele Goreng", "Ikan Tuna", "Ikan Tongkol", "Ikan Gurame Bakar", "Ikan Kembung", "Ikan Patin", "Bandeng Presto", "Ikan Bandeng Bakar", "Ikan Bawal Bakar", "Ikan Dori Panggang", "Ikan Salmon Panggang", "Ikan Kakap Asam Manis", "Teri Medan Kering", "Udang Rebus", "Udang Balado", "Udang Goreng Mentega", "Cumi-cumi", "Cumi Saus Tiram", "Kerang Dara Rebus", "Daging Sapi (Has Dalam/Tenderloin)", "Rendang Sapi", "Daging Sapi (Cincang)", "Sop Daging Sapi", "Empal Goreng", "Dendeng Balado", "Semur Daging Sapi", "Rawon Daging Sapi", "Tempe (Kukus/Panggang)", "Tempe Goreng", "Tempe Bacem", "Tempe Orek", "Tahu Putih (Kukus)", "Tahu Goreng", "Tahu Bacem", "Telur Ayam Rebus", "Telur Dadar", "Telur Asin", "Telur Ceplok (Mata Sapi)", "Telur Puyuh Rebus", "Telur Balado", "Telur Bumbu Rujak", "Telur Orak-Arik", "Telur Puyuh Balado", "Putih Telur", "Sate Ayam (Tanpa Bumbu Kacang)", "Sate Lilit Ayam", "Sate Kambing", "Sate Padang", "Tongseng Kambing", "Gulai Kambing"],
  defaultSides: ["Bayam Rebus", "Bayam Bening", "Bening Bayam Jagung", "Kangkung Tumis Air", "Cah Kangkung Saus Tiram", "Plecing Kangkung", "Brokoli Kukus", "Kembang Kol Rebus", "Wortel Rebus", "Buncis Rebus", "Tumis Kacang Panjang", "Sawi Hijau", "Sawi Putih", "Tumis Sawi Putih Bakso", "Tumis Pakcoy Bawang Putih", "Tauge Rebus", "Kubis / Kol Rebus", "Labu Siam Kukus", "Terong Balado (sedikit minyak)", "Sayur Sop (Wortel, Buncis, Kol)", "Sayur Asem", "Sayur Lodeh", "Capcay Kuah", "Tomat Segar", "Timun Segar", "Daun Singkong Rebus", "Tumis Daun Singkong", "Gulai Daun Singkong", "Daun Pepaya Rebus", "Tumis Bunga Pepaya", "Pare Rebus", "Tumis Pare Belut", "Oyong Rebus", "Sop Oyong Sohun", "Sop Kimlo", "Sayur Nangka Muda (Gulai)", "Sayur Rebung", "Pecel Sayur", "Gado-gado (Bumbu dipisah)", "Karedok", "Urap Sayur", "Trancam", "Asinan Sayur", "Acar Kuning", "Tumis Genjer", "Tumis Jamur Kancing", "Tumis Jamur Kuping"]
};
const DINNER = {
  carbs: ["Nasi Putih", "Nasi Merah", "Nasi Jagung", "Nasi Goreng", "Mie Telur (Rebus)", "Mie Goreng", "Bihun Goreng", "Kwetiau Goreng", "Bihun Jagung (Mentah)", "Misoa (Mentah)", "Soun Goreng", "Pasta Spaghetti (Rebus)", "Makaroni Gandum", "Kentang Rebus", "Ubi Jalar Rebus", "Singkong Rebus", "Lontong / Ketupat", "Jagung Manis Rebus", "Nasi Shirataki", "Mashed Potato (Kentang Tumbuk)"],
  defaultProteins: ["Dada Ayam (Rebus/Panggang)", "Paha Ayam Tnp Kulit", "Ayam Goreng Paha", "Ayam Bakar Taliwang", "Ayam Betutu", "Ikan Nila Panggang", "Ikan Tuna", "Ikan Tongkol", "Ikan Gurame Bakar", "Ikan Lele Bakar", "Ikan Lele Goreng", "Ikan Kembung", "Ikan Patin", "Bandeng Presto", "Ikan Bandeng Bakar", "Ikan Bawal Bakar", "Ikan Dori Panggang", "Ikan Salmon Panggang", "Teri Medan Kering", "Udang Rebus", "Cumi-cumi", "Kerang Dara Rebus", "Daging Sapi (Has Dalam/Tenderloin)", "Daging Sapi (Cincang)", "Sop Daging Sapi", "Semur Daging Sapi", "Tempe (Kukus/Panggang)", "Tempe Goreng", "Tempe Bacem", "Tempe Orek", "Tahu Putih (Kukus)", "Tahu Goreng", "Tahu Bacem", "Telur Ayam Rebus", "Telur Dadar", "Telur Ceplok (Mata Sapi)", "Telur Puyuh Rebus", "Telur Balado", "Telur Bumbu Rujak", "Telur Orak-Arik", "Telur Puyuh Balado", "Putih Telur", "Sate Ayam (Tanpa Bumbu Kacang)", "Sate Lilit Ayam", "Sate Kambing", "Sate Padang"],
  defaultSides: ["Bayam Rebus", "Bayam Bening", "Bening Bayam Jagung", "Kangkung Tumis Air", "Cah Kangkung Saus Tiram", "Plecing Kangkung", "Brokoli Kukus", "Kembang Kol Rebus", "Wortel Rebus", "Buncis Rebus", "Tumis Kacang Panjang", "Sawi Hijau", "Sawi Putih", "Tumis Sawi Putih Bakso", "Tumis Pakcoy Bawang Putih", "Tauge Rebus", "Kubis / Kol Rebus", "Labu Siam Kukus", "Sayur Sop (Wortel, Buncis, Kol)", "Sayur Asem", "Capcay Kuah", "Tomat Segar", "Timun Segar", "Daun Singkong Rebus", "Tumis Daun Singkong", "Daun Pepaya Rebus", "Tumis Bunga Pepaya", "Pare Rebus", "Tumis Pare Belut", "Oyong Rebus", "Sop Oyong Sohun", "Sop Kimlo", "Sayur Rebung", "Urap Sayur", "Trancam", "Acar Kuning", "Tumis Genjer", "Tumis Jamur Kancing", "Tumis Jamur Kuping"]
};
const CC = {
  "Oatmeal (Mentah)": { proteins: ["Susu Sapi Cair Low Fat", "Susu Sapi Cair Full Cream", "Yogurt Plain", "Susu Protein / Whey"], sides: ["Pisang Ambon", "Pisang Sunpride / Cavendish", "Apel", "Mangga Harumanis", "Buah Naga Merah", "Jeruk Manis", "Pepaya", "Alpukat", "Semangka", "Melon"] },
  "Roti Gandum": { proteins: ["Telur Ayam Rebus", "Telur Ceplok (Mata Sapi)", "Telur Dadar", "Telur Orak-Arik", "Susu Sapi Cair Low Fat", "Yogurt Plain"], sides: ["Pisang Ambon", "Pisang Sunpride / Cavendish", "Apel", "Jeruk Manis", "Pepaya", "Mangga Harumanis", "Semangka"] },
  "Roti Putih": { proteins: ["Telur Ayam Rebus", "Telur Ceplok (Mata Sapi)", "Telur Dadar", "Telur Orak-Arik", "Susu Sapi Cair Low Fat", "Yogurt Plain"], sides: ["Pisang Ambon", "Apel", "Jeruk Manis", "Pepaya", "Melon", "Semangka"] },
  "Roti Tawar Gandum Panggang": { proteins: ["Telur Ayam Rebus", "Telur Ceplok (Mata Sapi)", "Telur Dadar", "Telur Orak-Arik", "Susu Sapi Cair Low Fat", "Yogurt Plain"], sides: ["Pisang Ambon", "Apel", "Jeruk Manis", "Pepaya", "Melon", "Semangka"] },
  "Bubur Ayam (Tanpa Kuah)": { proteins: ["Telur Ayam Rebus", "Telur Puyuh Rebus", "Sate Ayam (Tanpa Bumbu Kacang)"], sides: [] },
  "Nasi Goreng": { proteins: ["Telur Ceplok (Mata Sapi)", "Telur Dadar", "Ayam Goreng Paha", "Paha Ayam Tnp Kulit", "Sate Ayam (Tanpa Bumbu Kacang)", "Ayam Bakar Taliwang"], sides: ["Timun Segar", "Tomat Segar", "Kubis / Kol Rebus", "Acar Kuning"] },
  "Nasi Kuning": { proteins: ["Telur Dadar", "Ayam Goreng Paha", "Ayam Bakar Taliwang", "Telur Balado", "Telur Bumbu Rujak", "Perkedel Kentang"], sides: ["Timun Segar", "Tomat Segar"] },
  "Nasi Liwet": { proteins: ["Ayam Goreng Paha", "Ayam Bakar Taliwang", "Ikan Bandeng Bakar", "Ikan Lele Goreng", "Telur Balado"], sides: ["Timun Segar", "Tomat Segar", "Daun Singkong Rebus"] },
  "Mie Goreng": { proteins: ["Telur Ceplok (Mata Sapi)", "Telur Dadar", "Ayam Goreng Paha", "Udang Rebus", "Daging Sapi (Cincang)"], sides: ["Sawi Hijau", "Sawi Putih", "Tomat Segar", "Timun Segar", "Tauge Rebus"] },
  "Bihun Goreng": { proteins: ["Telur Ceplok (Mata Sapi)", "Telur Dadar", "Ayam Goreng Paha", "Udang Rebus"], sides: ["Sawi Hijau", "Sawi Putih", "Wortel Rebus"] },
  "Kwetiau Goreng": { proteins: ["Telur Ceplok (Mata Sapi)", "Telur Dadar", "Ayam Goreng Paha", "Udang Rebus"], sides: ["Sawi Hijau", "Sawi Putih", "Tauge Rebus"] },
  "Soun Goreng": { proteins: ["Telur Ceplok (Mata Sapi)", "Telur Dadar", "Ayam Goreng Paha", "Udang Rebus"], sides: ["Sawi Hijau", "Sawi Putih", "Wortel Rebus"] },
  "Nasi Uduk": { proteins: ["Telur Ceplok (Mata Sapi)", "Telur Dadar", "Ayam Goreng Paha", "Tempe Goreng", "Tahu Goreng", "Paha Ayam Tnp Kulit", "Telur Ayam Rebus", "Telur Asin", "Semur Daging Sapi"], sides: ["Timun Segar", "Tomat Segar", "Acar Kuning"] },
  "Lontong / Ketupat": { proteins: ["Telur Ayam Rebus", "Tempe (Kukus/Panggang)", "Tempe Goreng", "Tahu Putih (Kukus)", "Tahu Goreng", "Sate Ayam (Tanpa Bumbu Kacang)", "Telur Asin", "Daging Sapi (Has Dalam/Tenderloin)"], sides: ["Sayur Lodeh", "Pecel Sayur", "Gado-gado (Bumbu dipisah)", "Sayur Sop (Wortel, Buncis, Kol)", "Capcay Kuah", "Labu Siam Kukus"] },
  "Mie Telur (Rebus)": { proteins: ["Telur Ayam Rebus", "Dada Ayam (Rebus/Panggang)", "Paha Ayam Tnp Kulit", "Udang Rebus", "Cumi-cumi", "Telur Dadar", "Telur Ceplok (Mata Sapi)", "Tumis Sawi Putih Bakso"], sides: ["Brokoli Kukus", "Sawi Hijau", "Sawi Putih", "Capcay Kuah", "Kangkung Tumis Air", "Tauge Rebus", "Kembang Kol Rebus"] },
  "Pasta Spaghetti (Rebus)": { proteins: ["Dada Ayam (Rebus/Panggang)", "Daging Sapi (Cincang)", "Udang Rebus", "Telur Ayam Rebus", "Cumi-cumi"], sides: ["Brokoli Kukus", "Wortel Rebus", "Sawi Hijau", "Tomat Segar", "Kembang Kol Rebus"] },
  "Makaroni Gandum": { proteins: ["Dada Ayam (Rebus/Panggang)", "Daging Sapi (Cincang)", "Susu Sapi Cair Full Cream", "Telur Ayam Rebus"], sides: ["Brokoli Kukus", "Wortel Rebus"] },
  // Diet / Root Carbs Overrides (To prevent them pairing with heavy normal dishes)
  "Jagung Manis Rebus": { proteins: ["Telur Ayam Rebus", "Susu Sapi Cair Low Fat", "Yogurt Plain"], sides: ["Bayam Bening", "Bening Bayam Jagung"] },
  "Singkong Rebus": { proteins: ["Telur Ayam Rebus", "Susu Sapi Cair Low Fat", "Yogurt Plain", "Teri Medan Kering"], sides: [] },
  "Ubi Jalar Rebus": { proteins: ["Telur Ayam Rebus", "Susu Sapi Cair Low Fat", "Yogurt Plain"], sides: [] },
  "Talas Rebus": { proteins: ["Telur Ayam Rebus"], sides: [] },
  "Kentang Rebus": { proteins: ["Dada Ayam (Rebus/Panggang)", "Ikan Tuna", "Telur Ayam Rebus", "Daging Sapi (Has Dalam/Tenderloin)"], sides: ["Brokoli Kukus", "Wortel Rebus", "Buncis Rebus"] },
  "Mashed Potato (Kentang Tumbuk)": { proteins: ["Dada Ayam (Rebus/Panggang)", "Ikan Salmon Panggang", "Daging Sapi (Has Dalam/Tenderloin)"], sides: ["Brokoli Kukus", "Wortel Rebus", "Buncis Rebus"] }
};
const PC = {
  // Prevent double soup (Kuah + Kuah) or force specific pairings
  "Semur Daging Sapi": { sides: ["Tumis Sawi Putih Bakso", "Tumis Pakcoy Bawang Putih", "Tumis Daun Singkong", "Bayam Rebus", "Kangkung Tumis Air", "Buncis Rebus", "Tumis Kacang Panjang"] },
  "Sop Daging Sapi": { sides: ["Perkedel Kentang", "Perkedel Jagung", "Tempe Goreng", "Tahu Goreng", "Tempe Bacem"] },
  "Rawon Daging Sapi": { sides: ["Tauge Rebus", "Telur Asin", "Tempe Goreng"] },
  "Tongseng Kambing": { sides: ["Tomat Segar", "Kubis / Kol Rebus", "Timun Segar"] },
  "Gulai Kambing": { sides: ["Daun Singkong Rebus", "Tumis Daun Singkong", "Timun Segar"] },
  "Gulai Ayam": { sides: ["Daun Singkong Rebus", "Tumis Daun Singkong", "Timun Segar"] },
  "Sayur Nangka Muda (Gulai)": { sides: ["Daun Singkong Rebus", "Tumis Daun Singkong"] },
  "Ayam Bakar Taliwang": { sides: ["Plecing Kangkung", "Timun Segar", "Tomat Segar"] },
  "Ayam Betutu": { sides: ["Plecing Kangkung", "Urap Sayur", "Tumis Kacang Panjang"] },
  "Ikan Bandeng Bakar": { sides: ["Sayur Asem", "Sayur Lodeh", "Kangkung Tumis Air", "Tomat Segar", "Timun Segar"] },
  "Ikan Lele Bakar": { sides: ["Tomat Segar", "Timun Segar", "Kubis / Kol Rebus", "Sayur Asem"] },
  "Ikan Lele Goreng": { sides: ["Tomat Segar", "Timun Segar", "Kubis / Kol Rebus", "Sayur Asem"] },
  "Ayam Goreng Paha": { sides: ["Sayur Asem", "Sayur Lodeh", "Tomat Segar", "Timun Segar"] },
  "Rendang Sapi": { sides: ["Daun Singkong Rebus", "Tumis Daun Singkong", "Timun Segar"] }
};
const SNACK_FRUITS = ["Pisang Ambon", "Pisang Sunpride / Cavendish", "Apel", "Jeruk Manis", "Pepaya", "Semangka", "Melon", "Mangga Harumanis", "Jambu Biji", "Buah Naga Merah", "Nanas", "Rambutan", "Duku", "Salak", "Kelengkeng", "Manggis", "Jambu Air", "Bengkoang", "Salad Buah", "Rujak Buah", "Asinan Buah", "Jus Alpukat", "Jus Jeruk", "Jus Apel", "Smoothie Pisang"];
const SNACK_PROTEINS = ["Yogurt Plain", "Yogurt Buah", "Susu Sapi Cair Low Fat", "Susu Protein / Whey", "Edamame Rebus", "Telur Ayam Rebus", "Telur Puyuh Rebus", "Pudding Susu", "Pudding Coklat", "Sari Kacang Hijau", "Susu Kedelai"];
const SNACK_NUTS = ["Kacang Almond", "Kacang Tanah Sangrai", "Kacang Kedelai Goreng", "Edamame Rebus", "Kacang Mete Panggang", "Kacang Kenari", "Kuaci Bunga Matahari"];
const SNACK_OTHERS = ["Kurma", "Air Kelapa Muda", "Bubur Kacang Hijau (Tanpa Santan)", "Kacang Hijau Rebus", "Daging Kelapa Muda", "Oatmeal Cookies"];
function getPool(carbName, pool, field) {
  const c = CC[carbName];
  if (c && c[field] !== void 0) return c[field];
  return pool["default" + field.charAt(0).toUpperCase() + field.slice(1)] || [];
}
function getValidSides(carbName, protName, pool, goal) {
  let sides = pool.defaultSides || [];
  let ccSides = CC[carbName] && CC[carbName].sides ? CC[carbName].sides : void 0;
  let pcSides = PC[protName] && PC[protName].sides ? PC[protName].sides : void 0;
  if (ccSides && pcSides) {
    const intersection = ccSides.filter((s) => pcSides.includes(s));
    sides = intersection.length > 0 ? intersection : ccSides;
  } else if (ccSides) {
    sides = ccSides;
  } else if (pcSides) {
    sides = pcSides;
  }
  return fg(sides, goal);
}
function buildMealFromPool(pool, targets, seed, goal) {
  const carbs = fg(pool.carbs, goal);
  const carb = pk(gf(carbs), seed);
  if (!carb) return [];
  const protNames = fg(getPool(carb.name, pool, "proteins"), goal);
  const prot = protNames.length ? pk(gf(protNames), seed + 31) : null;
  const sideNames = getValidSides(carb.name, prot ? prot.name : null, pool, goal);
  const side = sideNames.length ? pk(gf(sideNames), seed + 67) : null;
  const items = [];
  items.push(mi(carb, 1));
  if (prot) items.push(mi(prot, 1));
  if (side) items.push(mi(side, 1));
  return balanceMealMacros(items, targets);
}
function buildSnack(targets, seed, goal, splitType) {
  const r = sr(seed + 999);
  const fruits = fg(SNACK_FRUITS, goal);
  const proteins = fg(SNACK_PROTEINS, goal);
  const nuts = fg(SNACK_NUTS, goal);
  const others = fg(SNACK_OTHERS, goal);
  let pickFruit = false, pickProt = false, pickNut = false;
  if (splitType === "Lower Carb") {
    if (r < 0.1) pickFruit = true;
    else if (r < 0.3) {
      pickFruit = true;
      pickProt = true;
    } else if (r < 0.8) pickNut = true;
    else ;
  } else if (splitType === "Higher Carb") {
    if (r < 0.5) pickFruit = true;
    else if (r < 0.8) {
      pickFruit = true;
      pickProt = true;
    } else if (r < 0.9) pickNut = true;
    else ;
  } else {
    if (r < 0.35) pickFruit = true;
    else if (r < 0.65) {
      pickFruit = true;
      pickProt = true;
    } else if (r < 0.85) pickNut = true;
    else ;
  }
  const items = [];
  if (pickFruit && !pickProt) {
    const f = pk(gf(fruits), seed + 31);
    if (f) items.push(mi(f, 1));
  } else if (pickFruit && pickProt) {
    const f = pk(gf(fruits), seed + 31);
    const p = pk(gf(proteins), seed + 67);
    if (f) items.push(mi(f, 1));
    if (p) items.push(mi(p, 1));
  } else if (pickNut) {
    const n = pk(gf(nuts), seed + 31);
    if (n) items.push(mi(n, 1));
  } else {
    const o = pk(gf(others), seed + 31);
    if (o) items.push(mi(o, 1));
  }
  return balanceMealMacros(items, targets);
}
function buildMeal(type, targets, seed, goal, splitType) {
  switch (type) {
    case "breakfast":
      return buildMealFromPool(BREAKFAST, targets, seed, goal);
    case "lunch":
      return buildMealFromPool(LUNCH, targets, seed, goal);
    case "dinner":
      return buildMealFromPool(DINNER, targets, seed, goal);
    case "snack":
      return buildSnack(targets, seed, goal, splitType);
    default:
      return buildMealFromPool(LUNCH, targets, seed, goal);
  }
}
function generateWeeklyMealPlan(targetCalories, dailySplits, goal = "maintenance") {
  return dailySplits.map((split, dayIdx) => {
    const r = getMR(split.split);
    const dayP = targetCalories * r.p / 4, dayC = targetCalories * r.c / 4, dayF = targetCalories * r.f / 9;
    const meals = MEAL_SLOTS.map((slot, mealIdx) => {
      const t = { calories: targetCalories * slot.pct, protein: dayP * slot.pct, carbs: dayC * slot.pct, fats: dayF * slot.pct };
      const seed = dayIdx * 7919 + mealIdx * 6271 + 1009;
      const items = buildMeal(slot.gen, t, seed, goal, split.split);
      const totals = si(items);
      return {
        time: slot.time,
        type: slot.type,
        items,
        menu: items.map((i) => `${i.scaledPortion} ${i.displayName}`).join(" + "),
        protein: Math.round(totals.protein),
        carbs: Math.round(totals.carbs),
        fats: Math.round(totals.fats),
        calories: Math.round(totals.calories),
        _seed: seed,
        _gen: slot.gen,
        _targets: t,
        _goal: goal,
        _splitType: split.split
      };
    });
    return { day: split.label, date: split.date, splitType: split.split, meals };
  });
}
function rerollMeal(meal) {
  const ns = meal._seed + Math.floor(Math.random() * 5e3) + 500;
  const items = buildMeal(meal._gen, meal._targets, ns, meal._goal || "maintenance", meal._splitType || "Moderate Carb");
  const totals = si(items);
  return {
    ...meal,
    items,
    menu: items.map((i) => `${i.scaledPortion} ${i.displayName}`).join(" + "),
    protein: Math.round(totals.protein),
    carbs: Math.round(totals.carbs),
    fats: Math.round(totals.fats),
    calories: Math.round(totals.calories),
    _seed: ns
  };
}
function rerollMealItem(meal, itemIndex) {
  if (meal._gen === "snack") return rerollMeal(meal);
  let pool;
  if (meal._gen === "breakfast") pool = BREAKFAST;
  else if (meal._gen === "lunch") pool = LUNCH;
  else if (meal._gen === "dinner") pool = DINNER;
  else return meal;
  const goal = meal._goal || "maintenance";
  const ns = meal._seed + Math.floor(Math.random() * 5e3) + itemIndex * 100;
  if (itemIndex === 0) {
    const currentProt = meal.items[1] ? meal.items[1].name : null;
    const currentSide = meal.items[2] ? meal.items[2].name : null;
    const allCarbs = fg(pool.carbs, goal);
    let availableNames = allCarbs.filter((cName) => {
      const c = CC[cName];
      if (!c) return true;
      if (currentProt && c.proteins && !c.proteins.includes(currentProt)) return false;
      if (currentSide && c.sides && !c.sides.includes(currentSide)) return false;
      return true;
    });
    const currentItemName = meal.items[itemIndex].name;
    let filteredNames = availableNames.filter((n) => n !== currentItemName);
    if (filteredNames.length === 0) {
      filteredNames = allCarbs.filter((n) => n !== currentItemName);
    }
    const newCarbBase = pk(gf(filteredNames), ns);
    if (!newCarbBase) return meal;
    meal.items[0] = mi(newCarbBase, 1);
    const validProts = fg(getPool(newCarbBase.name, pool, "proteins"), goal);
    if (meal.items[1] && !validProts.includes(meal.items[1].name)) {
      const newProtBase = pk(gf(validProts), ns + 1);
      if (newProtBase) meal.items[1] = mi(newProtBase, 1);
    }
    const finalProtName = meal.items[1] ? meal.items[1].name : null;
    const validSides = getValidSides(newCarbBase.name, finalProtName, pool, goal);
    if (meal.items[2] && !validSides.includes(meal.items[2].name)) {
      const newSideBase = pk(gf(validSides), ns + 2);
      if (newSideBase) meal.items[2] = mi(newSideBase, 1);
    }
  } else if (itemIndex === 1) {
    const carbName = meal.items[0].name;
    let availableNames = fg(getPool(carbName, pool, "proteins"), goal);
    const currentItemName = meal.items[itemIndex].name;
    const filteredNames = availableNames.filter((n) => n !== currentItemName);
    const finalNames = filteredNames.length > 0 ? filteredNames : availableNames;
    const newProtBase = pk(gf(finalNames), ns);
    if (!newProtBase) return meal;
    meal.items[1] = mi(newProtBase, 1);
    const validSides = getValidSides(carbName, newProtBase.name, pool, goal);
    if (meal.items[2] && !validSides.includes(meal.items[2].name)) {
      const newSideBase = pk(gf(validSides), ns + 1);
      if (newSideBase) meal.items[2] = mi(newSideBase, 1);
    }
  } else if (itemIndex === 2) {
    const carbName = meal.items[0].name;
    const protName = meal.items[1] ? meal.items[1].name : null;
    let availableNames = getValidSides(carbName, protName, pool, goal);
    const currentItemName = meal.items[itemIndex].name;
    const filteredNames = availableNames.filter((n) => n !== currentItemName);
    const finalNames = filteredNames.length > 0 ? filteredNames : availableNames;
    const newSideBase = pk(gf(finalNames), ns);
    if (!newSideBase) return meal;
    meal.items[2] = mi(newSideBase, 1);
  }
  const newItems = balanceMealMacros(meal.items, meal._targets);
  const totals = si(newItems);
  return {
    ...meal,
    items: newItems,
    menu: newItems.map((i) => `${i.scaledPortion} ${i.displayName}`).join(" + "),
    protein: Math.round(totals.protein),
    carbs: Math.round(totals.carbs),
    fats: Math.round(totals.fats),
    calories: Math.round(totals.calories),
    _seed: ns
  };
}
function Show({ player, history, latestTest }) {
  const { auth } = usePage().props;
  const isAthlete = auth.user.role === "athlete";
  const [draftPlan, setDraftPlan] = useState(null);
  const activePlan = history.length > 0 ? history[0] : null;
  const [selectedGoal, setSelectedGoal] = useState("maintenance");
  const [startDate, setStartDate] = useState("");
  const [dailySplits, setDailySplits] = useState(
    Array(7).fill("Moderate Carb")
  );
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    setStartDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  }, []);
  const DIET_OPTIONS = [
    { label: "Lower", value: "Lower Carb" },
    { label: "Moderate", value: "Moderate Carb" },
    { label: "Higher", value: "Higher Carb" }
  ];
  const getWeekDays = () => {
    if (!startDate) return [];
    const days = [], start = new Date(startDate);
    const names = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu"
    ];
    for (let i = 0; i < 7; i++) {
      const c = new Date(start);
      c.setDate(start.getDate() + i);
      days.push({
        index: i,
        date: c.toISOString().split("T")[0],
        label: `${names[c.getDay()]}, ${c.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`
      });
    }
    return days;
  };
  const weekDays = getWeekDays();
  const getTargetCalories = () => {
    if (!latestTest) return 0;
    const m = Math.round(
      (parseFloat(latestTest.bmr) || 0) * (parseFloat(latestTest.activity_level) || 1.2)
    );
    if (selectedGoal === "cutting") return m - 500;
    if (selectedGoal === "bulking") return m + 500;
    return m;
  };
  const targetCalories = getTargetCalories();
  const handleSplitChange = (i, v) => {
    const s = [...dailySplits];
    s[i] = v;
    setDailySplits(s);
  };
  const handleGenerate = () => {
    if (!latestTest)
      return alert("Atlet belum memiliki data Komposisi Tubuh.");
    const splits = dailySplits.map((split, i) => ({
      date: weekDays[i]?.date,
      label: weekDays[i]?.label,
      split
    }));
    const weekly = generateWeeklyMealPlan(
      targetCalories,
      splits,
      selectedGoal
    );
    setDraftPlan({
      recommendation: selectedGoal,
      target_calories: targetCalories,
      weekly_meal_plan: weekly,
      macro_plan: {
        protein: { grams: Math.round(targetCalories * 0.3 / 4) },
        carbs: { grams: Math.round(targetCalories * 0.35 / 4) },
        fats: { grams: Math.round(targetCalories * 0.35 / 9) }
      },
      overall_assessment: `Rencana makan 7 hari untuk program ${selectedGoal} — target ${targetCalories} kcal/hari.`,
      hydration: {
        daily_water_liters: Math.round(
          (parseFloat(latestTest.weight) || 70) * 0.04 * 10
        ) / 10,
        pre_training: "500ml air, 2 jam sebelum latihan",
        during_training: "200ml setiap 15–20 menit",
        post_training: "Ganti 150% cairan yang hilang"
      }
    });
    setActiveTab(0);
    setIsModalOpen(false);
  };
  const handleRerollMeal = (dayIdx, mealIdx) => {
    setDraftPlan((prev) => {
      const p = { ...prev }, w = [...p.weekly_meal_plan];
      const d = { ...w[dayIdx], meals: [...w[dayIdx].meals] };
      d.meals[mealIdx] = rerollMeal(d.meals[mealIdx]);
      w[dayIdx] = d;
      p.weekly_meal_plan = w;
      return p;
    });
  };
  const handleRerollItem = (dayIdx, mealIdx, itemIdx) => {
    setDraftPlan((prev) => {
      const p = { ...prev }, w = [...p.weekly_meal_plan];
      const d = { ...w[dayIdx], meals: [...w[dayIdx].meals] };
      d.meals[mealIdx] = rerollMealItem(d.meals[mealIdx], itemIdx);
      w[dayIdx] = d;
      p.weekly_meal_plan = w;
      return p;
    });
  };
  const handleSavePlan = () => {
    if (!draftPlan) return;
    const clean = draftPlan.weekly_meal_plan.map((day) => ({
      day: day.day,
      date: day.date,
      splitType: day.splitType,
      meals: day.meals.map((m) => ({
        time: m.time,
        type: m.type,
        menu: m.menu,
        protein: m.protein,
        carbs: m.carbs,
        fats: m.fats,
        calories: m.calories,
        items: m.items?.map((i) => ({
          name: i.displayName || i.name,
          scaledPortion: i.scaledPortion,
          protein: i.protein,
          carbs: i.carbs,
          fats: i.fats,
          calories: i.calories
        }))
      }))
    }));
    router.post(
      route("admin.meal-plans.store"),
      {
        user_id: player.id,
        recommendation: draftPlan.recommendation,
        target_calories: draftPlan.target_calories,
        protein_target: draftPlan.macro_plan?.protein?.grams || 0,
        carbs_target: draftPlan.macro_plan?.carbs?.grams || 0,
        fats_target: draftPlan.macro_plan?.fats?.grams || 0,
        weekly_plan: clean,
        hydration_plan: draftPlan.hydration,
        supplements_plan: [],
        notes: draftPlan.overall_assessment,
        warnings: ""
      },
      { onSuccess: () => setDraftPlan(null) }
    );
  };
  const handleDelete = (id) => {
    if (confirm("Yakin ingin menghapus rencana makan ini?"))
      router.delete(route("admin.meal-plans.destroy", id));
  };
  const planToDisplay = draftPlan || activePlan;
  const isDraft = !!draftPlan;
  const weeklyStats = useMemo(() => {
    if (!planToDisplay) return null;
    const days = planToDisplay.weekly_plan || planToDisplay.weekly_meal_plan || [];
    let cal = 0, p = 0, c = 0, f = 0;
    const perDay = days.map((day) => {
      const d = { calories: 0, protein: 0, carbs: 0, fats: 0 };
      (day.meals || []).forEach((m) => {
        d.calories += m.calories || 0;
        d.protein += m.protein || 0;
        d.carbs += m.carbs || 0;
        d.fats += m.fats || 0;
      });
      cal += d.calories;
      p += d.protein;
      c += d.carbs;
      f += d.fats;
      return d;
    });
    return {
      total: {
        calories: Math.round(cal),
        protein: Math.round(p),
        carbs: Math.round(c),
        fats: Math.round(f)
      },
      perDay
    };
  }, [planToDisplay]);
  const weeklyTarget = (planToDisplay?.target_calories || targetCalories) * 7;
  const renderPlanDetails = () => /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-zinc-200 p-4 shadow-sm hover:border-orange-300 hover:shadow-md transition-all group", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-zinc-500 font-bold text-[10px] uppercase tracking-widest", children: "Target Kalori" }),
          /* @__PURE__ */ jsx(
            Flame,
            {
              size: 14,
              className: "text-orange-500 group-hover:scale-110 transition-transform"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors", children: planToDisplay.target_calories || "-" }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400 font-medium text-[12px]", children: "kcal/hr" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-zinc-200 p-4 shadow-sm hover:border-rose-300 hover:shadow-md transition-all group", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-zinc-500 font-bold text-[10px] uppercase tracking-widest", children: "Protein" }),
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-rose-500 group-hover:scale-125 transition-transform" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-zinc-900 group-hover:text-rose-600 transition-colors", children: planToDisplay.protein_target || planToDisplay.macro_plan?.protein?.grams || "-" }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400 font-medium text-[12px]", children: "g/hr" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-zinc-200 p-4 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-zinc-500 font-bold text-[10px] uppercase tracking-widest", children: "Karbohidrat" }),
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-zinc-900 group-hover:text-emerald-600 transition-colors", children: planToDisplay.carbs_target || planToDisplay.macro_plan?.carbs?.grams || "-" }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400 font-medium text-[12px]", children: "g/hr" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-zinc-200 p-4 shadow-sm hover:border-amber-300 hover:shadow-md transition-all group", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-zinc-500 font-bold text-[10px] uppercase tracking-widest", children: "Lemak" }),
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-zinc-900 group-hover:text-amber-600 transition-colors", children: planToDisplay.fats_target || planToDisplay.macro_plan?.fats?.grams || "-" }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400 font-medium text-[12px]", children: "g/hr" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `rounded-xl border p-4 shadow-sm transition-all group ${weeklyStats?.total.calories <= weeklyTarget ? "bg-orange-50/50 border-orange-200 hover:border-orange-400 hover:shadow-md" : "bg-red-50 border-red-200 hover:border-red-400 hover:shadow-md"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
              /* @__PURE__ */ jsx(
                "h3",
                {
                  className: `font-bold text-[10px] uppercase tracking-widest ${weeklyStats?.total.calories <= weeklyTarget ? "text-orange-700" : "text-red-700"}`,
                  children: "Total Mg."
                }
              ),
              weeklyStats?.total.calories <= weeklyTarget ? /* @__PURE__ */ jsx(
                CheckCircle2,
                {
                  size: 14,
                  className: "text-orange-500"
                }
              ) : null
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-baseline gap-1", children: /* @__PURE__ */ jsx(
              "p",
              {
                className: `text-xl font-black leading-none ${weeklyStats?.total.calories <= weeklyTarget ? "text-orange-600 group-hover:text-orange-700" : "text-red-600 group-hover:text-red-700"}`,
                children: weeklyStats?.total.calories.toLocaleString()
              }
            ) }),
            /* @__PURE__ */ jsxs(
              "p",
              {
                className: `font-medium text-[12px] mt-1 ${weeklyStats?.total.calories <= weeklyTarget ? "text-orange-600/70" : "text-red-600/70"}`,
                children: [
                  "dari ",
                  weeklyTarget.toLocaleString(),
                  " kcal"
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex overflow-x-auto hide-scrollbar gap-3 pb-6 border-b border-zinc-100 px-1", children: (planToDisplay.weekly_plan || planToDisplay.weekly_meal_plan || []).map((day, idx) => {
        const dateObj = new Date(day.date);
        const dayNumber = dateObj.getDate();
        const monthName = dateObj.toLocaleDateString("id-ID", { month: "short" });
        const dayName = day.day.split(",")[0];
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveTab(idx),
            className: `shrink-0 flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg border transition-all ${activeTab === idx ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 scale-100" : "bg-white border-zinc-200 text-zinc-500 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold uppercase tracking-widest mb-1 ${activeTab === idx ? "text-orange-100" : "text-zinc-400"}`, children: dayName }),
              /* @__PURE__ */ jsx("span", { className: "text-2xl font-black leading-none", children: dayNumber }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] font-medium mt-1 ${activeTab === idx ? "text-orange-200" : "text-zinc-400"}`, children: monthName })
            ]
          },
          idx
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: "pt-6", children: (() => {
        const day = (planToDisplay.weekly_plan || planToDisplay.weekly_meal_plan || [])[activeTab];
        if (!day) return null;
        const dayTotals = weeklyStats?.perDay?.[activeTab];
        return /* @__PURE__ */ jsxs("div", { className: "animate-in fade-in duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl p-5 md:p-2 text-white mb-6 shadow-lg shadow-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center gap-6 text-center md:text-left relative z-10", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-white/20 backdrop-blur-md p-3 rounded-xl flex flex-col items-center justify-center shrink-0 border border-white/30 shadow-inner", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-orange-100", children: day.day.split(",")[0] }),
                /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-white leading-none mt-1", children: new Date(day.date).getDate() })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-xl font-black text-white", children: "Jadwal Makan Harian" }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: day.splitType && /* @__PURE__ */ jsx("span", { className: "inline-flex gap-1.5 text-xs font-bold text-white ", children: day.splitType }) })
              ] })
            ] }),
            dayTotals && /* @__PURE__ */ jsxs("div", { className: "px-6 py-2 text-center min-w-[180px] relative z-10 shadow-inner", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-orange-200", children: "Target Harian" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-center gap-1.5", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold text-white", children: [
                  Math.round(dayTotals.calories).toLocaleString(),
                  " / ",
                  Math.round(planToDisplay?.target_calories || targetCalories).toLocaleString()
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-orange-200 font-bold text-sm uppercase", children: "kcal" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative pb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 bottom-0 left-[19px] md:left-[27px] w-[3px] bg-gradient-to-b from-orange-200 via-orange-100 to-transparent rounded-full hidden sm:block" }),
            day.meals.map((meal, mealIdx) => /* @__PURE__ */ jsxs("div", { className: "relative mb-8 last:mb-0 group", children: [
              /* @__PURE__ */ jsx("div", { className: "hidden sm:flex absolute top-7 left-0 md:left-3 w-8 h-8 rounded-full bg-white border-[3px] border-orange-500 items-center justify-center shadow-lg shadow-orange-500/30 z-10 transition-transform group-hover:scale-110", children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-orange-500" }) }),
              /* @__PURE__ */ jsx("div", { className: "bg-white border border-zinc-100 rounded-xl p-5 md:p-6 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all ml-0 sm:ml-16 md:ml-20 relative overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-start justify-between gap-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-2xl md:text-xl font-bold text-zinc-900 tracking-tight", children: meal.time }),
                    /* @__PURE__ */ jsx("span", { className: "px-3 py-1.5  text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-sm", children: meal.type })
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-zinc-500 font-medium text-xs flex items-center gap-1.5 mb-2", children: [
                    "Target kalori: ",
                    /* @__PURE__ */ jsxs("span", { className: "text-zinc-800 font-bold ", children: [
                      meal.calories,
                      " kcal"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-3", children: meal.items && meal.items.length > 0 ? meal.items.map((item, iIdx) => /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between p-2.5 rounded-xl bg-zinc-50 hover:bg-orange-50/50 border border-transparent hover:border-orange-200 transition-colors group/item", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-4 h-4 rounded-full bg-white shadow-sm border border-zinc-100 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-orange-400" }) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("span", { className: "block text-[13px] text-zinc-800 font-bold", children: item.displayName || item.name }),
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5", children: [
                          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-zinc-400 uppercase tracking-wider", children: [
                            item.calories,
                            " kcal"
                          ] }),
                          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-medium text-rose-500 bg-rose-50 px-1.5 rounded", children: [
                            "P: ",
                            item.protein,
                            "g"
                          ] }),
                          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-medium text-emerald-500 bg-emerald-50 px-1.5 rounded", children: [
                            "C: ",
                            item.carbs,
                            "g"
                          ] }),
                          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-medium text-amber-500 bg-amber-50 px-1.5 rounded", children: [
                            "F: ",
                            item.fats,
                            "g"
                          ] })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 shrink-0", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[12px] text-zinc-600 font-bold mt-0.5", children: item.scaledPortion }),
                      isDraft && /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => handleRerollItem(activeTab, mealIdx, iIdx),
                          title: "Ganti bahan ini",
                          className: "opacity-0 group-hover/item:opacity-100 hover:text-zinc-500 text-zinc-300 transition-all mt-0.5",
                          children: /* @__PURE__ */ jsx(RefreshCw, { size: 14, strokeWidth: 2.5 })
                        }
                      )
                    ] })
                  ] }, iIdx)) : /* @__PURE__ */ jsx("p", { className: "text-zinc-800 font-semibold px-2", children: meal.menu }) }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-2 border-t border-zinc-100 flex flex-wrap items-center gap-3", children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-md text-xs font-bold border border-rose-100", children: [
                      "Protein ",
                      /* @__PURE__ */ jsxs("span", { className: "text-rose-900", children: [
                        meal.protein,
                        "g"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-100", children: [
                      "Carbo ",
                      /* @__PURE__ */ jsxs("span", { className: "text-emerald-900", children: [
                        meal.carbs,
                        "g"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-md text-xs font-bold border border-amber-100", children: [
                      "Fat ",
                      /* @__PURE__ */ jsxs("span", { className: "text-amber-900", children: [
                        meal.fats,
                        "g"
                      ] })
                    ] })
                  ] })
                ] }),
                isDraft && /* @__PURE__ */ jsx("div", { className: "shrink-0 mt-4 md:mt-0 flex justify-end", children: /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => handleRerollMeal(activeTab, mealIdx),
                    title: "Reroll set menu lengkap",
                    className: "flex items-center gap-2 px-3 py-2 bg-white hover:bg-orange-500 text-zinc-400 hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm border border-zinc-200 hover:border-orange-500 group-hover:opacity-100 sm:opacity-0",
                    children: [
                      /* @__PURE__ */ jsx(RefreshCw, { size: 16, strokeWidth: 2.5 }),
                      /* @__PURE__ */ jsx("span", { className: "sm:hidden group-hover:inline-block", children: "Reroll Sesi" })
                    ]
                  }
                ) })
              ] }) })
            ] }, mealIdx))
          ] })
        ] });
      })() })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5 mt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-orange-300 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 group-hover:bg-orange-100 transition-colors" }),
        /* @__PURE__ */ jsxs("h4", { className: "text-[11px] font-black text-orange-500 uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10", children: [
          /* @__PURE__ */ jsx(Target, { size: 16 }),
          " Objektif Program"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-800 font-medium leading-relaxed relative z-10", children: planToDisplay.notes || planToDisplay.overall_assessment })
      ] }),
      (planToDisplay.hydration_plan || planToDisplay.hydration) && /* @__PURE__ */ jsxs("div", { className: "bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-sky-300 transition-colors", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-full -mr-12 -mt-12 group-hover:bg-sky-100 transition-colors" }),
        /* @__PURE__ */ jsxs("h4", { className: "text-[11px] font-black text-sky-500 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10", children: [
          /* @__PURE__ */ jsx(Droplets, { size: 16 }),
          " Panduan Hidrasi ·",
          " ",
          /* @__PURE__ */ jsxs("span", { className: "text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded ml-1", children: [
            (planToDisplay.hydration_plan || planToDisplay.hydration).daily_water_liters,
            " ",
            "L/hari"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3 relative z-10", children: [
          (planToDisplay.hydration_plan || planToDisplay.hydration).pre_training,
          (planToDisplay.hydration_plan || planToDisplay.hydration).during_training,
          (planToDisplay.hydration_plan || planToDisplay.hydration).post_training
        ].filter(Boolean).map((t, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-start gap-3 text-sm text-zinc-700 font-semibold bg-zinc-50 p-3 rounded-xl border border-zinc-100",
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" }),
              t
            ]
          },
          i
        )) })
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsxs(
    AppLayout,
    {
      title: `Rencana Makan ${player.name}`,
      description: "Manajemen rencana makan atlet",
      children: [
        /* @__PURE__ */ jsx(Head, { title: `Rencana Makan - ${player.name}` }),
        /* @__PURE__ */ jsxs("div", { className: "pb-24 space-y-8", children: [
          /* @__PURE__ */ jsx(
            PageHeader,
            {
              title: `Rencana Makan ${player.name}`,
              subtitle: "Manajemen nutrisi dan jadwal diet khusus klien.",
              badge: "Nutrisi & Diet",
              icon: Flame,
              actions: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 w-full sm:w-auto", children: !isAthlete && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    href: route("admin.meal-plans.index"),
                    className: "inline-flex flex-1 md:flex-none items-center justify-center rounded-xl text-sm font-bold transition-colors border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 h-10 px-5 shadow-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2",
                    children: [
                      /* @__PURE__ */ jsx(
                        ChevronLeft,
                        {
                          size: 16,
                          className: "mr-1.5"
                        }
                      ),
                      "Kembali"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setIsModalOpen(true),
                    className: "inline-flex flex-[2] md:flex-none items-center justify-center rounded-xl text-sm font-bold transition-all bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 h-10 px-6 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { size: 16, className: "mr-1.5" }),
                      /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Buat Rencana Baru" }),
                      /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Generate" })
                    ]
                  }
                )
              ] }) })
            }
          ),
          /* @__PURE__ */ jsx(
            Modal,
            {
              show: isModalOpen,
              onClose: () => setIsModalOpen(false),
              maxWidth: "4xl",
              children: /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden relative", children: [
                /* @__PURE__ */ jsx("div", { className: "px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-2 bg-orange-50 text-orange-500 rounded-lg", children: /* @__PURE__ */ jsx(UtensilsIcon, { size: 18 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-zinc-900", children: "Meal Plan Generator" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500 font-medium mt-0.5", children: "Atur preferensi makro dan hasilkan menu otomatis." })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "p-6 overflow-y-auto max-h-[75vh]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                    /* @__PURE__ */ jsxs("div", { className: "bg-zinc-50 p-5 rounded-2xl border border-zinc-200 flex flex-col", children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-3", children: "1. Target Program" }),
                      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 flex-1", children: [
                        "cutting",
                        "maintenance",
                        "bulking"
                      ].map((g) => /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => setSelectedGoal(g),
                          className: `py-2 px-2 rounded-xl text-[12px] font-bold transition-all border ${selectedGoal === g ? "bg-white border-orange-500 text-orange-600 shadow-sm ring-1 ring-orange-500" : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"}`,
                          children: /* @__PURE__ */ jsx("span", { className: "capitalize", children: g })
                        },
                        g
                      )) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "bg-zinc-50 p-5 rounded-2xl border border-zinc-200 flex gap-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                        /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-3", children: "2. Tanggal Mulai" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "date",
                            value: startDate,
                            onChange: (e) => setStartDate(e.target.value),
                            className: "w-full bg-white border border-zinc-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-700 transition-colors shadow-sm"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "w-36 shrink-0 bg-orange-500 text-white rounded-xl flex flex-col items-center justify-center p-3 shadow-lg shadow-orange-500/20", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-orange-100 mb-1", children: "Target Kalori" }),
                        /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-white", children: targetCalories }),
                        /* @__PURE__ */ jsx("p", { className: "text-[9px] font-medium text-orange-100 mb-2", children: "kcal/hari" }),
                        /* @__PURE__ */ jsx("div", { className: "w-full h-px bg-orange-400 mb-2" }),
                        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-white", children: (targetCalories * 7).toLocaleString() }),
                        /* @__PURE__ */ jsx("p", { className: "text-[9px] font-medium text-orange-200 mt-0.5", children: "kcal/minggu" })
                      ] })
                    ] })
                  ] }),
                  !latestTest && /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3", children: [
                    /* @__PURE__ */ jsx(
                      Info,
                      {
                        className: "text-red-500 shrink-0 mt-0.5",
                        size: 18
                      }
                    ),
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-red-700", children: "Atlet belum memiliki data Komposisi Tubuh. Tes diperlukan untuk kalkulasi TDEE akurat." })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col", children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-4", children: "3. Distribusi Nutrisi (7 Hari)" }),
                    startDate ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: weekDays.map((day, idx) => /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "bg-white border border-zinc-200 rounded-xl p-4 flex flex-col items-center text-center shadow-sm hover:border-orange-300 transition-colors group",
                        children: [
                          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-orange-500 transition-colors", children: day.label.split(",")[1]?.trim() }),
                          /* @__PURE__ */ jsx("p", { className: "text-[14px] font-black text-zinc-800 mt-1 mb-3", children: day.label.split(",")[0]?.trim() }),
                          /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
                            "select",
                            {
                              value: dailySplits[idx],
                              onChange: (e) => handleSplitChange(
                                idx,
                                e.target.value
                              ),
                              className: "w-full bg-zinc-50 border border-zinc-200 rounded-lg text-[12px] font-bold text-zinc-700 py-2 pl-3 pr-8 cursor-pointer focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:bg-white shadow-sm transition-all text-left",
                              children: DIET_OPTIONS.map(
                                (o) => /* @__PURE__ */ jsx(
                                  "option",
                                  {
                                    value: o.value,
                                    children: o.label
                                  },
                                  o.value
                                )
                              )
                            }
                          ) })
                        ]
                      },
                      idx
                    )) }) : /* @__PURE__ */ jsx("div", { className: "border border-dashed border-zinc-300 rounded-xl flex items-center justify-center bg-white p-8", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400 font-medium text-center", children: "Pilih tanggal mulai terlebih dahulu." }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-3 mt-2", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => setIsModalOpen(false),
                        className: "px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-all text-sm",
                        children: "Batal"
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: handleGenerate,
                        disabled: !latestTest || !startDate,
                        className: "px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm",
                        children: [
                          /* @__PURE__ */ jsx(Target, { size: 18 }),
                          "Buat Rencana Otomatis"
                        ]
                      }
                    )
                  ] })
                ] }) })
              ] })
            }
          ),
          planToDisplay && !isDraft ? /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            renderPlanDetails(),
            !isAthlete && activePlan && !isDraft && /* @__PURE__ */ jsx("div", { className: "pt-4 pb-12 flex justify-center", children: /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleDelete(activePlan.id),
                className: "py-2.5 px-4 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 font-bold flex items-center justify-center gap-2 rounded-xl transition-all",
                children: [
                  /* @__PURE__ */ jsx(Trash2, { size: 14 }),
                  " Hapus Rencana Makan Ini"
                ]
              }
            ) })
          ] }) : !isDraft && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-zinc-200 py-24 flex flex-col items-center justify-center shadow-sm mt-8", children: [
            /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(Activity, { className: "text-zinc-400", size: 32 }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-zinc-900", children: "Belum Ada Rencana Makan" }),
            /* @__PURE__ */ jsx("p", { className: "text-zinc-500 mt-2 max-w-sm text-center text-sm font-medium", children: isAthlete ? "Anda belum memiliki jadwal rencana makan. Silakan tunggu pelatih Anda." : "Gunakan generator di atas untuk menciptakan menu secara otomatis." })
          ] }),
          /* @__PURE__ */ jsx(
            Modal,
            {
              show: isDraft && !!planToDisplay,
              onClose: () => setDraftPlan(null),
              maxWidth: "5xl",
              children: /* @__PURE__ */ jsxs("div", { className: "bg-white overflow-hidden flex flex-col max-h-[90vh]", children: [
                /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-orange-500 to-orange-600 p-6 md:p-8 shrink-0 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden z-20", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 pointer-events-none" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 relative z-10", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-white/20 text-white rounded-xl backdrop-blur-sm", children: /* @__PURE__ */ jsx(Info, { size: 24 }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsxs("h3", { className: "text-xl font-black text-white flex items-center gap-3", children: [
                        "Draft Rencana Makan",
                        /* @__PURE__ */ jsx("span", { className: "px-2.5 py-1 rounded-md text-[10px] font-bold bg-white text-orange-600 uppercase tracking-widest shadow-sm", children: "Unsaved" })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-orange-50 mt-1.5", children: "Periksa jadwal di bawah. Klik ikon putar (↻) pada bahan spesifik untuk menggantinya secara otomatis." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-3 w-full md:w-auto shrink-0 relative z-10", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => setDraftPlan(null),
                        className: "flex-1 md:flex-none px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all text-sm backdrop-blur-sm border border-white/20",
                        children: "Batal"
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: handleSavePlan,
                        className: "flex-1 md:flex-none px-6 py-3 bg-white hover:bg-orange-50 text-orange-600 rounded-xl font-black transition-all flex items-center justify-center gap-2 text-sm shadow-sm",
                        children: [
                          /* @__PURE__ */ jsx(Save, { size: 18 }),
                          " Simpan Permanen"
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "p-6 md:p-8 overflow-y-auto bg-zinc-50/50 flex-1 min-h-0", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto pb-8", children: planToDisplay && renderPlanDetails() }) })
              ] })
            }
          )
        ] })
      ]
    }
  );
}
function UtensilsIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...props,
      children: [
        /* @__PURE__ */ jsx("path", { d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" }),
        /* @__PURE__ */ jsx("path", { d: "M7 2v20" }),
        /* @__PURE__ */ jsx("path", { d: "M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" })
      ]
    }
  );
}
export {
  Show as default
};
