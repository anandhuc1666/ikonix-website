import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ChevronDown, SlidersHorizontal, X } from "lucide-react";

const API = "https://ikonix-backend.vercel.app/api";
const PAGE_SIZE = 12;
const ORANGE = "#e85d04";
const PRICE_RANGES = [
  { label: "Below ₹ 500", min: 0, max: 500 },
  { label: "₹ 500 - 1,000", min: 500, max: 1000 },
  { label: "₹ 1,000 - 2,000", min: 1000, max: 2000 },
  { label: "₹ 2,000 - 5,000", min: 2000, max: 5000 },
  { label: "Above ₹ 5,000", min: 5000, max: Infinity },
];

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="h-[170px] animate-pulse bg-gray-200 sm:h-[190px]" />
      <div className="space-y-3 p-3">
        <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-2/5 animate-pulse rounded bg-gray-200" />
        <div className="h-8 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [availability, setAvailability] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expanded, setExpanded] = useState({
    category: true,
    brand: true,
    price: true,
    availability: true,
    sort: true,
  });
  const loadMoreRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API}/products/getAllProducts`);
      setProducts(response.data?.products || []);
    } catch (err) {
      console.error("Fetch products error:", err.response?.data || err.message);
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const categories = useMemo(
    () =>
      [...new Set(products.map((p) => p.category).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [products],
  );
  const brands = useMemo(
    () =>
      [...new Set(products.map((p) => p.brandName).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [products],
  );

  const toggle = (value, setter) =>
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result = products.filter((p) => {
      const matchesSearch =
        !term ||
        p.productName?.toLowerCase().includes(term) ||
        p.brandName?.toLowerCase().includes(term) ||
        p.modelNumber?.toLowerCase().includes(term) ||
        p.shortDescription?.toLowerCase().includes(term);
      const matchesCategory =
        !selectedCategories.length || selectedCategories.includes(p.category);
      const matchesBrand =
        !selectedBrands.length || selectedBrands.includes(p.brandName);
      const price = Number(p.price) || 0;
      const matchesPrice =
        !selectedPrices.length ||
        selectedPrices.some((label) => {
          const range = PRICE_RANGES.find((r) => r.label === label);
          return range && price >= range.min && price <= range.max;
        });
      const inStock = Number(p.stock) > 0;
      const matchesAvailability =
        availability === "All" ||
        (availability === "In Stock" && inStock) ||
        (availability === "Out of Stock" && !inStock);
      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesPrice &&
        matchesAvailability
      );
    });

    if (sortBy === "price-low")
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    else if (sortBy === "price-high")
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    else if (sortBy === "name")
      result.sort((a, b) =>
        (a.productName || "").localeCompare(b.productName || ""),
      );
    else
      result.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    return result;
  }, [
    products,
    search,
    selectedCategories,
    selectedBrands,
    selectedPrices,
    availability,
    sortBy,
  ]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    search,
    selectedCategories,
    selectedBrands,
    selectedPrices,
    availability,
    sortBy,
  ]);

  const hasMore = visibleCount < filteredProducts.length;
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || loading || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((count) =>
            Math.min(count + PAGE_SIZE, filteredProducts.length),
          );
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loading, hasMore, filteredProducts.length]);

  const getImage = (product) => {
    if (Array.isArray(product.Image) && product.Image[0])
      return product.Image[0];
    if (typeof product.Image === "string" && product.Image)
      return product.Image;
    return "/placeholder-product.png";
  };
  const formatPrice = (price) =>
    `₹ ${Number(price || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPrices([]);
    setAvailability("All");
    setSortBy("newest");
    setSearch("");
    window.history.replaceState({}, "", "/products/page");
  };

  const toggleSection = (key) =>
    setExpanded((old) => ({ ...old, [key]: !old[key] }));
  const header = (key, label) => (
    <button
      type="button"
      onClick={() => toggleSection(key)}
      className="flex w-full items-center justify-between py-2 text-left text-sm font-semibold text-gray-800"
    >
      {label}
      <ChevronDown
        size={15}
        className={`transition-transform ${expanded[key] ? "rotate-180" : ""}`}
      />
    </button>
  );
  const checkRow = (label, checked, onChange, count) => (
    <label
      key={label}
      className="flex cursor-pointer items-center gap-2 py-1.5 text-xs text-gray-600 hover:text-gray-900"
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[#e85d04]"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-gray-400">({count})</span>}
    </label>
  );


  const sidebar = (
    <aside className="max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filter Products</h2>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-medium"
          style={{ color: ORANGE }}
        >
          Clear All
        </button>
      </div>
      <div className="border-t border-gray-100">
        {header("category", "Category")}
        {expanded.category && (
          <div className="pb-3">
            {categories.map((name) =>
              checkRow(
                name,
                selectedCategories.includes(name),
                () => toggle(name, setSelectedCategories),
                products.filter((p) => p.category === name).length,
              ),
            )}
            {!categories.length && (
              <p className="py-2 text-xs text-gray-400">
                No categories available
              </p>
            )}
          </div>
        )}
      </div>
      <div className="border-t border-gray-100">
        {header("brand", "Brand")}
        {expanded.brand && (
          <div className="pb-3">
            {brands.map((name) =>
              checkRow(
                name,
                selectedBrands.includes(name),
                () => toggle(name, setSelectedBrands),
                products.filter((p) => p.brandName === name).length,
              ),
            )}
            {!brands.length && (
              <p className="py-2 text-xs text-gray-400">No brands available</p>
            )}
          </div>
        )}
      </div>
      <div className="border-t border-gray-100">
        {header("price", "Price Range")}
        {expanded.price && (
          <div className="pb-3">
            {PRICE_RANGES.map((r) =>
              checkRow(r.label, selectedPrices.includes(r.label), () =>
                toggle(r.label, setSelectedPrices),
              ),
            )}
          </div>
        )}
      </div>
      <div className="border-t border-gray-100">
        {header("availability", "Availability")}
        {expanded.availability && (
          <div className="pb-3">
            {checkRow("All Products", availability === "All", () =>
              setAvailability("All"),
            )}
            {checkRow(
              "In Stock",
              availability === "In Stock",
              () => setAvailability("In Stock"),
              products.filter((p) => Number(p.stock) > 0).length,
            )}
            {checkRow(
              "Out of Stock",
              availability === "Out of Stock",
              () => setAvailability("Out of Stock"),
              products.filter((p) => Number(p.stock) <= 0).length,
            )}
          </div>
        )}
      </div>
      <div className="border-t border-gray-100">
        {header("sort", "Sort By")}
        {expanded.sort && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mb-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#e85d04]"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Product Name</option>
          </select>
        )}
      </div>
    </aside>
  );

  return (
    <main className="mt-15 w-full bg-white sm:mt-25">
      <div className="mx-auto max-w-[1400px] px-5 pt-5 sm:px-8 lg:px-10">
        <p className="text-[10px] uppercase text-gray-500 sm:text-xs">
          <Link to="/" className="hover:text-[#e85d04]">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-800">Products</span>
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands or model numbers..."
              className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-[#e85d04]"
            />
          </div>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm lg:hidden"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8 lg:px-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Featured Products
            </h1>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Top selling and most popular instruments
            </p>
          </div>
          <span className="text-xs text-gray-500">
            {loading
              ? "Loading..."
              : `${filteredProducts.length} products found`}
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
          <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">{sidebar}</div>
          <section>
            {error && !loading && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}{" "}
                <button onClick={fetchProducts} className="underline">
                  Retry
                </button>
              </div>
            )}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <p className="font-medium text-gray-800">No products found</p>
                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-md px-4 py-2 text-sm text-white"
                  style={{ background: ORANGE }}
                >
                  Clear Filters
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }, (_, i) => (
                    <ProductSkeleton key={i} />
                  ))
                : visibleProducts.map((product) => (
                    <Link
                      key={product._id}
                      to={`/products/page/${product._id}`}
                      className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#e85d04]/60 hover:shadow-lg"
                    >
                      <div className="flex h-[160px] items-center justify-center overflow-hidden bg-white p-2 sm:h-[190px]">
                        <img
                          src={getImage(product)}
                          alt={product.productName || "Product"}
                          loading="lazy"
                          onLoad={(e) =>
                            e.currentTarget.classList.remove(
                              "blur-md",
                              "scale-105",
                            )
                          }
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/placeholder-product.png";
                            e.currentTarget.classList.remove(
                              "blur-md",
                              "scale-105",
                            );
                          }}
                          className="h-full w-full  scale-105 object-contain blur-md transition-all duration-500 group-hover:scale-100"
                        />
                      </div>
                      <div className="p-3">
                        {product.brandName && (
                          <p
                            className="text-[10px] font-bold uppercase tracking-wide sm:text-xs"
                            style={{ color: ORANGE }}
                          >
                            {product.brandName}
                          </p>
                        )}
                        <h2 className="mt-1 line-clamp-2 min-h-9 text-xs font-medium leading-4 text-gray-800 sm:text-sm">
                          {product.productName}
                        </h2>
                        {product.modelNumber && (
                          <p className="mt-1 truncate text-[10px] text-gray-400 sm:text-xs">
                            Model: {product.modelNumber}
                          </p>
                        )}
                        <p
                          className="mt-3 text-sm font-semibold sm:text-base"
                          style={{ color: ORANGE }}
                        >
                          {formatPrice(product.price)}
                        </p>
                        <p
                          className={`mt-1 flex items-center gap-1 text-[10px] sm:text-xs ${Number(product.stock) > 0 ? "text-green-600" : "text-red-500"}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${Number(product.stock) > 0 ? "bg-green-500" : "bg-red-500"}`}
                          />
                          {Number(product.stock) > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </p>
                        <div className="mt-3 rounded-md border border-[#e85d04] px-2 py-2 text-center text-[10px] font-medium text-[#e85d04] transition group-hover:bg-[#e85d04] group-hover:text-white sm:text-xs">
                          View Details
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
            {!loading && hasMore && (
              <div
                ref={loadMoreRef}
                className="flex justify-center py-8"
                aria-live="polite"
              >
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-orange-100 border-t-[#e85d04]" />
                <span className="sr-only">Loading more products</span>
              </div>
            )}
            {!loading && !hasMore && filteredProducts.length > PAGE_SIZE && (
              <p className="py-8 text-center text-xs text-gray-400">
                You’ve reached the end of the products.
              </p>
            )}
          </section>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>
            {sidebar}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-4 w-full rounded-lg py-3 text-sm font-semibold text-white"
              style={{ background: ORANGE }}
            >
              Show {filteredProducts.length} Products
            </button>
          </div>
        </div>
      )}

      <section className="border-t border-gray-100 bg-[#fafafa]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:py-14 lg:px-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 sm:text-3xl">
              Product Catalogue <span style={{ color: ORANGE }}>Enquiry</span>
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Looking for the right test and measurement instrument?
            </p>
            <p className="mt-2 max-w-xl text-xs leading-5 text-gray-500 sm:text-sm">
              Tell us what you need to measure. Our team can help you identify a
              suitable product for your application.
            </p>
          </div>
          <Link
            to="/contact/page"
            className="inline-flex items-center justify-center rounded-md px-6 py-3 text-xs font-medium text-white transition hover:opacity-90"
            style={{ background: ORANGE }}
          >
            Learn More About Us
          </Link>
        </div>
      </section>
    </main>
  );
}
