import * as React from 'react'
import {
  FaAddressBook,
  FaAddressCard,
  FaAngleDoubleDown,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaArrowCircleDown,
  FaArrowDown,
  FaBirthdayCake,
  FaBuilding,
  FaCalendarAlt,
  FaCaretDown,
  FaCaretUp,
  FaChartArea,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaCheck,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClone,
  FaCloudDownloadAlt,
  FaCog,
  FaDatabase,
  FaEllipsisH,
  FaEnvelope,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaEye,
  FaFile,
  FaFileAlt,
  FaFileArchive,
  FaFileDownload,
  FaFileExport,
  FaFileImport,
  FaFileUpload,
  FaFilter,
  FaFont,
  FaGripVertical,
  FaInfoCircle,
  FaLock,
  FaLockOpen,
  FaMinus,
  FaPaperPlane,
  FaPencilAlt,
  FaPlus,
  FaPlusCircle,
  FaQuestionCircle,
  FaRegCalendarCheck,
  FaRegChartBar,
  FaRegImage,
  FaReply,
  FaSearch,
  FaSlidersH,
  FaSort,
  FaSyncAlt,
  FaTable,
  FaThList,
  FaTimes,
  FaUserAlt,
  FaUserCircle,
  FaUsers,
} from 'react-icons/fa'

export interface IconProps {
  color?: string
  size?: number
}

export interface Props extends IconProps {
  name: keyof typeof iconMap
  className?: string
}

export const iconMap = {
  'fa-address-book': FaAddressBook,
  'fa-address-card': FaAddressCard,
  'fa-angle-double-down': FaAngleDoubleDown,
  'fa-angle-double-left': FaAngleDoubleLeft,
  'fa-angle-double-right': FaAngleDoubleRight,
  'fa-angle-down': FaAngleDown,
  'fa-angle-left': FaAngleLeft,
  'fa-angle-right': FaAngleRight,
  'fa-arrow-circle-down': FaArrowCircleDown,
  'fa-arrow-down': FaArrowDown,
  'fa-birthday-cake': FaBirthdayCake,
  'fa-building': FaBuilding,
  'fa-calendar-alt': FaCalendarAlt,
  'fa-caret-down': FaCaretDown,
  'fa-caret-up': FaCaretUp,
  'fa-chart-area': FaChartArea,
  'fa-chart-bar': FaChartBar,
  'fa-chart-line': FaChartLine,
  'fa-chart-pie': FaChartPie,
  'fa-check': FaCheck,
  'fa-check-circle': FaCheckCircle,
  'fa-chevron-left': FaChevronLeft,
  'fa-chevron-right': FaChevronRight,
  'fa-clone': FaClone,
  'fa-cloud-download-alt': FaCloudDownloadAlt,
  'fa-cog': FaCog,
  'fa-databas': FaDatabase,
  'fa-ellipsis-h': FaEllipsisH,
  'fa-envelope': FaEnvelope,
  'fa-exclamation-circle': FaExclamationCircle,
  'fa-exclamation-triangle': FaExclamationTriangle,
  'fa-external-link-alt': FaExternalLinkAlt,
  'fa-eye': FaEye,
  'fa-file': FaFile,
  'fa-file-alt': FaFileAlt,
  'fa-file-archive': FaFileArchive,
  'fa-file-download': FaFileDownload,
  'fa-file-export': FaFileExport,
  'fa-file-import': FaFileImport,
  'fa-file-upload': FaFileUpload,
  'fa-filter': FaFilter,
  'fa-font': FaFont,
  'fa-grip-vertical': FaGripVertical,
  'fa-info-circle': FaInfoCircle,
  'fa-lock': FaLock,
  'fa-lock-open': FaLockOpen,
  'fa-minus': FaMinus,
  'fa-paper-plane': FaPaperPlane,
  'fa-pencil-alt': FaPencilAlt,
  'fa-plus': FaPlus,
  'fa-plus-circle': FaPlusCircle,
  'fa-question-circle': FaQuestionCircle,
  'fa-reg-calendar-check': FaRegCalendarCheck,
  'fa-reg-chart-bar': FaRegChartBar,
  'fa-reg-image': FaRegImage,
  'fa-reply': FaReply,
  'fa-search': FaSearch,
  'fa-sliders-h': FaSlidersH,
  'fa-sort': FaSort,
  'fa-sync-alt': FaSyncAlt,
  'fa-table': FaTable,
  'fa-th-list': FaThList,
  'fa-times': FaTimes,
  'fa-user-alt': FaUserAlt,
  'fa-user-circle': FaUserCircle,
  'fa-users': FaUsers,
}
export const Icon: React.FC<Props> = ({ name, className = '', ...props }) => {
  const SvgIcon = iconMap[name]
  return <SvgIcon className={className} {...props} />
}
