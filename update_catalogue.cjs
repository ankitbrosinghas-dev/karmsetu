const fs = require('fs');
const path = require('path');

const filePath = 'src/pages/learner/igot/IgotCatalogue.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace imports
content = content.replace(
  "import { IgotMockService } from '../../../services/igot/igotMockService';",
  "import { igotCourseService } from '../../../services/igot/igotCourseService';"
);

content = content.replace(
  "const igotService = new IgotMockService();\n",
  ""
);

// Add debounced search logic
const logicSearch = `
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    loadCourses();
  }, [debouncedQuery, filters]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      // Utilizing igotCourseService to handle dynamic queries
      const data = await igotCourseService.searchCourses(debouncedQuery, filters);
      setCourses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
`;

content = content.replace(
  /useEffect\(\(\) => \{\n\s*loadCourses\(\);\n\s*\}, \[searchQuery, filters\]\);\n\n\s*const loadCourses = async \(\) => \{[\s\S]*?setLoading\(false\);\n\s*\}\n\s*\};/,
  logicSearch
);

fs.writeFileSync(filePath, content);
console.log('Catalogue updated');
