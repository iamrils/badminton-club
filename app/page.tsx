"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { BadmintonRecord } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const [records, setRecords] = useState<BadmintonRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<BadmintonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFromSheet, setTotalFromSheet] = useState(0);
  const itemsPerPage = 100;

  useEffect(() => {
    fetchRecords();
    fetchTotal();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, startDate, endDate]);

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/records");
      const data = await response.json();
      setRecords(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching records:", error);
      setLoading(false);
    }
  };

  const fetchTotal = async () => {
    try {
      const response = await fetch("/api/total");
      const data = await response.json();
      setTotalFromSheet(data.total);
    } catch (error) {
      console.error("Error fetching total:", error);
    }
  };

  const filterRecords = () => {
    let filtered = [...records];

    if (startDate) {
      // Set time to start of day for comparison
      const startTime = new Date(startDate);
      startTime.setHours(0, 0, 0, 0);

      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.tanggal);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate >= startTime;
      });
    }

    if (endDate) {
      // Set time to end of day for comparison
      const endTime = new Date(endDate);
      endTime.setHours(23, 59, 59, 999);

      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.tanggal);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate <= endTime;
      });
    }

    // Sort by no descending (latest/bottom records first)
    filtered.sort((a, b) => b.no - a.no);

    setFilteredRecords(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const getTodayTotal = () => {
    // Only calculate if date filter is applied
    if (!startDate && !endDate) {
      return 0;
    }

    const today = new Date().toISOString().split("T")[0];
    return filteredRecords
      .filter((record) => record.tanggal === today)
      .reduce((sum, record) => sum + record.selisih, 0);
  };

  const getAllTimeTotal = () => {
    return totalFromSheet || 0;
  };

  const getFilteredTotal = () => {
    return filteredRecords.reduce((sum, record) => sum + record.selisih, 0);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                💰 Kas Badminton
              </h1>
              <p className="text-gray-600 text-lg">
                Sistem Pencatatan Kas Harian
              </p>
            </div>
            <Link
              href="/skor"
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg font-semibold"
            >
              🏸 Skor Pencatatan
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Total Kas Hari Ini - Only show when date filter is applied */}
          {startDate && endDate && (
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-none shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white/90 text-lg font-semibold">
                    Total Kas Periode Terpilih
                  </CardTitle>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-5xl sm:text-6xl font-bold text-white mb-3">
                  Rp {getFilteredTotal().toLocaleString("id-ID")}
                </p>
                <CardDescription className="text-white/80 text-sm font-medium">
                  {startDate && endDate
                    ? `${startDate.toLocaleDateString(
                        "id-ID"
                      )} - ${endDate.toLocaleDateString("id-ID")}`
                    : startDate
                    ? `Dari ${startDate.toLocaleDateString("id-ID")}`
                    : endDate
                    ? `Sampai ${endDate.toLocaleDateString("id-ID")}`
                    : "Pilih periode"}
                </CardDescription>
              </CardContent>
            </Card>
          )}

          <Card
            className={`bg-gradient-to-br from-teal-600 to-cyan-600 border-none shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 hover:scale-[1.02] ${
              !(startDate && endDate) ? "lg:col-span-2" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white/90 text-lg font-semibold">
                  Total Kas Keseluruhan
                </CardTitle>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-5xl sm:text-6xl font-bold text-white mb-3">
                Rp {getAllTimeTotal().toLocaleString("id-ID")}
              </p>
              <CardDescription className="text-white/80 text-sm font-medium">
                Akumulasi dari {records.length} transaksi
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Date Range Picker */}
        <Card className="shadow-xl border-emerald-100 hover:shadow-2xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              📅 Filter Periode
            </CardTitle>
            <CardDescription>
              Pilih rentang tanggal untuk memfilter data transaksi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Tanggal Mulai
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => {
                    setStartDate(date);
                    if (!date) {
                      setEndDate(null);
                    }
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih tanggal mulai"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-medium transition-all"
                  isClearable
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Tanggal Akhir
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate ?? undefined}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih tanggal akhir"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-800 font-medium transition-all"
                  isClearable
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="shadow-xl border-emerald-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  📊 Data Transaksi
                </CardTitle>
                <CardDescription className="mt-1">
                  Menampilkan {startIndex + 1}-
                  {Math.min(endIndex, filteredRecords.length)} dari{" "}
                  {filteredRecords.length} transaksi
                  {filteredRecords.length < records.length &&
                    ` (terfilter dari ${records.length} total)`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Total Bola
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Harga Sebenarnya
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Harga Dibayar
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Selisih
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Tanggal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg
                              className="w-10 h-10 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-500 font-medium text-lg">
                            Tidak ada data ditemukan
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Coba ubah filter tanggal Anda
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentRecords.map((record, index) => (
                      <tr
                        key={record.no}
                        className={`hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 font-bold text-sm">
                            {record.no}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800">
                            🏸 {record.totalBola} bola
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                          Rp {record.hargaSebenarnya.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                          Rp {record.hargaDibayar.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                              record.selisih >= 0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {record.selisih >= 0 ? "+" : ""}Rp{" "}
                            {record.selisih.toLocaleString("id-ID")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                          📅{" "}
                          {new Date(record.tanggal).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-emerald-100 px-6 py-4 bg-gradient-to-r from-emerald-50/50 via-teal-50/50 to-cyan-50/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 font-medium">
                  Halaman {currentPage} dari {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
                  >
                    ⏮️ Pertama
                  </button>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
                  >
                    ◀️ Prev
                  </button>

                  {/* Page numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`px-3 py-2 rounded-lg border font-medium text-sm transition-all ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-md"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-emerald-50 hover:border-emerald-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
                  >
                    Next ▶️
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
                  >
                    Terakhir ⏭️
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
