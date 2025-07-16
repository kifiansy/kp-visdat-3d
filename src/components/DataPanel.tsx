import React from "react";
import {
  X,
  Users,
  Percent,
  GraduationCap,
  Clock,
  Calendar,
} from "lucide-react";

interface DataPanelProps {
  data: any;
  onClose: () => void;
  isOpen: boolean;
}

const DataPanel: React.FC<DataPanelProps> = ({ data, onClose, isOpen }) => {
  if (!data) return null;

  return (
    <div
      className={`fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-slate-900/95 to-indigo-900/95 backdrop-blur-xl border-l border-cyan-500/30 transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-cyan-400">Detail Data</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 rounded-xl border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-2">{data.alasan}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {data.jumlah_mahasiswa}
                  </p>
                  <p className="text-sm text-gray-300">Mahasiswa</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Percent className="w-5 h-5 text-pink-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {data.persentase}%
                  </p>
                  <p className="text-sm text-gray-300">Persentase</p>
                </div>
              </div>
            </div>
          </div>

          {/* Demografi */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-4 rounded-xl border border-blue-500/30">
            <h4 className="text-lg font-semibold text-cyan-400 mb-3">
              Demografi
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-300 mb-1">Jenis Kelamin</p>
                <div className="flex justify-between">
                  <span className="text-white">
                    Pria: {data.demografi?.jenis_kelamin?.Pria || 0}
                  </span>
                  <span className="text-white">
                    Wanita: {data.demografi?.jenis_kelamin?.Wanita || 0}
                  </span>
                </div>
              </div>

              {/* Batch/Angkatan Information */}
              <div>
                <p className="text-sm text-gray-300 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Sebaran Angkatan
                </p>
                {data.demografi?.angkatan_tahun_masuk &&
                  Object.entries(data.demografi.angkatan_tahun_masuk).map(
                    ([year, count]) => (
                      <div key={year} className="flex justify-between mb-1">
                        <span className="text-white">Angkatan {year}:</span>
                        <span className="text-cyan-400 font-semibold">
                          {count as number}
                        </span>
                      </div>
                    )
                  )}
              </div>

              <div>
                <p className="text-sm text-gray-300 mb-1">Asal Daerah</p>
                {data.demografi?.asal_daerah &&
                  Object.entries(data.demografi.asal_daerah).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-white">{key}:</span>
                        <span className="text-cyan-400">{value as number}</span>
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>

          {/* Akademik */}
          {data.akademik && (
            <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 p-4 rounded-xl border border-green-500/30">
              <h4 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Akademik
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">IPK Rata-rata:</span>
                  <span className="text-white font-semibold">
                    {data.akademik.ipk_terakhir_rata_rata}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Semester:</span>
                  <span className="text-white font-semibold">
                    {data.akademik.jumlah_semester_ditempuh_rata_rata}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Detail Skripsi */}
          {data.detail_skripsi && (
            <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 p-4 rounded-xl border border-orange-500/30">
              <h4 className="text-lg font-semibold text-orange-400 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Detail Skripsi
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Rata-rata Revisi:</span>
                  <span className="text-white font-semibold">
                    {data.detail_skripsi.jumlah_revisi_rata_rata}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Lama Penelitian:</span>
                  <span className="text-white font-semibold">
                    {data.detail_skripsi.lama_penelitian_bulan_rata_rata} bulan
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Topik Sesuai Minat:</span>
                  <span className="text-white font-semibold">
                    {data.detail_skripsi.topik_sesuai_minat_persen}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Dukungan */}
          {data.dukungan_diakses && (
            <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 p-4 rounded-xl border border-violet-500/30">
              <h4 className="text-lg font-semibold text-violet-400 mb-3">
                Akses Dukungan
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Konseling Akademik:</span>
                  <span className="text-white font-semibold">
                    {data.dukungan_diakses.konseling_akademik_diakses}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Workshop Skripsi:</span>
                  <span className="text-white font-semibold">
                    {data.dukungan_diakses.workshop_skripsi_diikuti}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataPanel;
