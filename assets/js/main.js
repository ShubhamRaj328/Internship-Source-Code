// Main JavaScript file containing common functionality across all pages

// Common variables and utilities
let isNotificationDropdownOpen = false

// Theme Management
class ThemeManager {
    constructor() {
        this.init()
    }

    init() {
        this.initializeTheme()
        this.setupThemeToggle()
        this.setupCrossPageTheme()
    }

    initializeTheme() {
        const userTheme = localStorage.getItem("theme")
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

        if (userTheme === "dark" || (!userTheme && systemTheme === "dark")) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById("theme-toggle")
        const themeToggleIcon = document.getElementById("theme-toggle-icon")
        const themeToggleIconDark = document.getElementById("theme-toggle-icon-dark")

        if (themeToggle) {
            themeToggle.addEventListener("click", () => {
                document.documentElement.classList.toggle("dark")

                if (document.documentElement.classList.contains("dark")) {
                    localStorage.setItem("theme", "dark")
                } else {
                    localStorage.setItem("theme", "light")
                }

                if (themeToggleIcon && themeToggleIconDark) {
                    themeToggleIcon.classList.add("rotate")
                    themeToggleIconDark.classList.add("rotate")

                    setTimeout(() => {
                        themeToggleIcon.classList.remove("rotate")
                        themeToggleIconDark.classList.remove("rotate")
                    }, 500)
                }

                // Trigger custom event for pages that need to update charts
                window.dispatchEvent(new CustomEvent("themeChanged"))
            })
        }
    }

    setupCrossPageTheme() {
        function setCookie(name, value, days) {
            let expires = ""
            if (days) {
                const date = new Date()
                date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
                expires = "; expires=" + date.toUTCString()
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/"
        }

        function getCookie(name) {
            const nameEQ = name + "="
            const ca = document.cookie.split(";")
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i]
                while (c.charAt(0) === " ") c = c.substring(1, c.length)
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
            }
            return null
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    const isDark = document.documentElement.classList.contains("dark")
                    setCookie("theme", isDark ? "dark" : "light", 365)
                }
            })
        })

        observer.observe(document.documentElement, { attributes: true })

        document.addEventListener("DOMContentLoaded", () => {
            const savedTheme = getCookie("theme") || localStorage.getItem("theme")
            if (savedTheme) {
                if (savedTheme === "dark") {
                    document.documentElement.classList.add("dark")
                } else {
                    document.documentElement.classList.remove("dark")
                }
            }
        })
    }
}

// Sidebar Management
class SidebarManager {
    constructor() {
        this.init()
    }

    init() {
        this.setupSidebarToggle()
        this.setupMobileOverlay()
    }

    setupSidebarToggle() {
        const sidebarToggleMobile = document.getElementById("sidebar-toggle-mobile")
        const sidebarToggleDesktop = document.getElementById("sidebar-toggle-desktop")
        const sidebar = document.getElementById("sidebar")
        const sidebarOverlay = document.getElementById("sidebar-overlay")
        const mainContent = document.getElementById("main-content")
        const header = document.querySelector("header")

        if (sidebarToggleMobile) {
            sidebarToggleMobile.addEventListener("click", () => {
                sidebar.classList.toggle("-translate-x-full")
                sidebarOverlay.classList.toggle("hidden")
            })
        }

        if (sidebarToggleDesktop) {
            sidebarToggleDesktop.addEventListener("click", () => {
                sidebar.classList.toggle("sidebar-collapsed")

                if (sidebar.classList.contains("sidebar-collapsed")) {
                    mainContent.classList.remove("lg:ml-64")
                    mainContent.classList.add("lg:ml-16")
                    header.classList.remove("lg:left-64")
                    header.classList.add("lg:left-16")
                } else {
                    mainContent.classList.remove("lg:ml-16")
                    mainContent.classList.add("lg:ml-64")
                    header.classList.remove("lg:left-16")
                    header.classList.add("lg:left-64")
                }
            })
        }
    }

    setupMobileOverlay() {
        const sidebarOverlay = document.getElementById("sidebar-overlay")
        const sidebar = document.getElementById("sidebar")

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener("click", () => {
                sidebar.classList.add("-translate-x-full")
                sidebarOverlay.classList.add("hidden")
            })
        }
    }
}

// Logout Management
class LogoutManager {
    constructor() {
        this.init()
    }

    init() {
        this.setupLogoutModal()
    }

    setupLogoutModal() {
        const logoutBtn = document.getElementById("logoutBtn")
        const logoutModal = document.getElementById("logoutModal")
        const cancelLogout = document.getElementById("cancelLogout")
        const confirmLogout = document.getElementById("confirmLogout")

        if (logoutBtn && logoutModal) {
            logoutBtn.addEventListener("click", () => {
                this.openModal(logoutModal)
            })

            if (cancelLogout) {
                cancelLogout.addEventListener("click", () => {
                    this.closeModal(logoutModal)
                })
            }

            if (confirmLogout) {
                confirmLogout.addEventListener("click", () => {
                    confirmLogout.innerHTML = '<i class="ph ph-spinner ph-spin mr-2"></i>Logging out...'
                    confirmLogout.disabled = true

                    setTimeout(() => {
                        localStorage.clear()
                        sessionStorage.clear()
                        window.location.href = "login.html"
                    }, 1000)
                })
            }

            logoutModal.addEventListener("click", (e) => {
                if (e.target === logoutModal) {
                    this.closeModal(logoutModal)
                }
            })
        }
    }

    openModal(modal) {
        modal.classList.remove("hidden")
        document.body.classList.add("modal-open")
        // Store current scroll position
        this.scrollPosition = window.pageYOffset
        document.body.style.top = `-${this.scrollPosition}px`
        document.body.style.position = "fixed"
        document.body.style.width = "100%"
    }

    closeModal(modal) {
        modal.classList.add("hidden")
        document.body.classList.remove("modal-open")
        // Restore scroll position
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
        window.scrollTo(0, this.scrollPosition)
    }
}

// Header Spacer Management
class HeaderSpacerManager {
    constructor() {
        this.init()
    }

    init() {
        window.addEventListener("DOMContentLoaded", () => {
            const header = document.querySelector("header")
            const spacer = document.getElementById("header-spacer")

            if (header && spacer) {
                const adjustSpacerHeight = () => {
                    spacer.style.height = header.offsetHeight + "px"
                }

                adjustSpacerHeight()
                window.addEventListener("resize", adjustSpacerHeight)
            }
        })
    }
}

// Notification Dropdown Management
class NotificationManager {
    constructor() {
        this.init()
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            const notificationBtn = document.getElementById("notification-btn")
            const notificationDropdown = document.getElementById("notification-dropdown")

            if (notificationBtn && notificationDropdown) {
                notificationBtn.addEventListener("click", (e) => {
                    e.stopPropagation()
                    if (isNotificationDropdownOpen) {
                        notificationDropdown.classList.remove("show")
                        isNotificationDropdownOpen = false
                    } else {
                        notificationDropdown.classList.add("show")
                        isNotificationDropdownOpen = true
                    }
                })

                document.addEventListener("click", (e) => {
                    if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
                        notificationDropdown.classList.remove("show")
                        isNotificationDropdownOpen = false
                    }
                })
            }
        })
    }
}

// Utility Functions
const Utils = {
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    },

    formatDateTime(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    },

    showNotification(message, type = "success") {
        const notification = document.createElement("div")
        notification.className = `fixed top-4 right-4 bg-${type === "success" ? "green" : "red"}-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="ph ph-${type === "success" ? "check-circle" : "warning-circle"} mr-2"></i>
                ${message}
            </div>
        `

        document.body.appendChild(notification)

        setTimeout(() => {
            notification.style.opacity = "0"
            notification.style.transform = "translateX(100%)"
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification)
                }
            }, 300)
        }, 3000)
    },

    getStatusBadge(status, extraClasses = "") {
        const badges = {
            active: "bg-green-100 text-green-800 dark:bg-[rgba(22,163,74,0.2)] dark:text-green-400",
            inactive: "bg-gray-100 text-gray-800 dark:bg-[rgba(75,85,99,0.2)] dark:text-gray-400",
            vip: "bg-yellow-100 text-yellow-800 dark:bg-[rgba(202,138,4,0.2)] dark:text-yellow-400",
            pending: "bg-gray-100 text-gray-800 dark:bg-[rgba(75,85,99,0.2)] dark:text-gray-400",
            processing: "bg-yellow-100 text-yellow-800 dark:bg-[rgba(202,138,4,0.2)] dark:text-yellow-400",
            shipped: "bg-blue-100 text-blue-800 dark:bg-[rgba(37,99,235,0.2)] dark:text-blue-400",
            delivered: "bg-green-100 text-green-800 dark:bg-[rgba(22,163,74,0.2)] dark:text-green-400",
            cancelled: "bg-red-100 text-red-800 dark:bg-[rgba(220,38,38,0.2)] dark:text-red-400",
            "in-stock": "bg-green-100 text-green-800 dark:bg-[rgba(22,163,74,0.2)] dark:text-green-400",
            "low-stock": "bg-yellow-100 text-yellow-800 dark:bg-[rgba(202,138,4,0.2)] dark:text-yellow-400",
            "out-of-stock": "bg-red-100 text-red-800 dark:bg-[rgba(220,38,38,0.2)] dark:text-red-400",
        }

        const labels = {
            active: "Active",
            inactive: "Inactive",
            vip: "VIP",
            pending: "Pending",
            processing: "Processing",
            shipped: "Shipped",
            delivered: "Delivered",
            cancelled: "Cancelled",
            "in-stock": "In Stock",
            "low-stock": "Low Stock",
            "out-of-stock": "Out of Stock",
        }

        return `<span class="px-2 py-1 text-xs font-medium rounded-full ${badges[status]} ${extraClasses}">${labels[status]}</span>`
    },
}

// Initialize all managers when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new ThemeManager()
    new SidebarManager()
    new LogoutManager()
    new HeaderSpacerManager()
    new NotificationManager()
})

// Global console log for main functionality
console.log("🏪 Main JavaScript functionality loaded successfully!")
