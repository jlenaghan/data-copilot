"use client";

import * as React from "react";
import {
  ArrowDown,
  MessageSquare,
  Cpu,
  Compass,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  DownloadCloud,
  Play,
  ExternalLink,
  Table as TableIcon,
  FileText,
  GitBranch,
  BookOpen,
  Filter,
  Calendar,
  Network,
  Box,
  MapPin,
  Activity,
  BarChart2,
  Stethoscope,
  Users,
  Briefcase,
  Building,
  Hospital,
  Database,
  User,
  Settings,
  LogOut,
  Maximize2,
  Minimize2,
  Info,
  Download,
  FolderOpen,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CustomCheckboxProps {
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ id, onChange }) => {
  return (
    <input
      type="checkbox"
      id={id}
      onChange={onChange}
    />
  );
};

const JOINT_REPLACEMENT_QUERY = `
SELECT
        "STATE" AS state
        ,SUM(orthopaedic_surgeon) AS orthopaedic_surgeons
        ,SUM(orthopaedic_surgery) AS orthopaedic_surgeries
        ,SUM(population) AS population
        ,SUM(housing_units) AS housing_units
        ,SUM(population_male) AS population_male
        ,SUM(population_female) AS population_female
        ,SUM(education_less_than_high_school) AS education_less_than_high_school
        ,SUM(education_high_school_graduate) AS education_high_school_graduate
        ,SUM(education_associate_degree) AS education_associate_degree
        ,SUM(education_bachelors_or_higher) AS education_bachelors_or_higher
        ,SUM(education_professional_school) AS education_professional_school
        ,SUM(household_income_below_25k) AS household_income_below_25k
        ,SUM(household_income_25k_to_45k) + SUM(household_income_45k_to_60k) AS household_income_25k_to_60k
        ,SUM(household_income_60k_to_100k) AS household_income_60k_to_100k
        ,SUM(household_income_100k_to_150k) + SUM(household_income_150k_to_200k) AS household_income_100k_to_200k
        ,SUM(household_income_above_200k) AS household_income_above_200k
        ,SUM(population_white) AS population_white
        ,SUM(population_black_african_american) AS population_black_african_american
        ,SUM(population_american_indian_alaska_native) AS population_american_indian_alaska_native
        ,SUM(population_asian) AS population_asian
        ,SUM(population_native_hawaiian_pacific_islander) AS population_native_hawaiian_pacific_islander
        ,SUM(population_other) AS population_other
        ,SUM(population_two_or_more_races) AS population_two_or_more_races
FROM
    (SELECT DISTINCT A."ZIPCODE"
                    ,A."STATE"
                    ,B.hsanum
                    ,B.hsacity
                    ,B.hsastate
                    ,B.hrrnum
                    ,B.hrrcity
                    ,B.hrrstate
                    ,C.population
                    ,C.housing_units
                    ,C.population_male
                    ,C.population_female
                    ,C.education_less_than_high_school
                    ,C.education_high_school_graduate
                    ,C.education_associate_degree
                    ,C.education_bachelors_or_higher
                    ,C.education_professional_school
                    ,C.household_income_below_25k
                    ,C.household_income_25k_to_45k
                    ,C.household_income_45k_to_60k
                    ,C.household_income_60k_to_100k
                    ,C.household_income_100k_to_150k
                    ,C.household_income_150k_to_200k
                    ,C.household_income_above_200k
                    ,C.population_white
                    ,C.population_black_african_american
                    ,C.population_american_indian_alaska_native
                    ,C.population_asian
                    ,C.population_native_hawaiian_pacific_islander
                    ,C.population_other
                    ,C.population_two_or_more_races
                    ,D.orthopaedic_surgeon
                    ,D.orthopaedic_surgery
    FROM zipcodes A
    LEFT JOIN zip_crosswalks_ziphsahrr19 B
        ON A."ZIPCODE"=B.zipcode19
    LEFT JOIN zip_to_census C
        ON A."ZIPCODE"=C.zip_code
    LEFT JOIN
            (SELECT substr("Provider Business Practice Location Address Postal Code",1,5) AS pvd_zip
                    ,SUM(CASE WHEN "Entity Type Code"=1 THEN 1 ELSE 0 END) AS orthopaedic_surgeon
                    ,SUM(CASE WHEN "Entity Type Code"=2 THEN 1 ELSE 0 END) AS orthopaedic_surgery
            FROM nppes_npidata_pfile_2005052320240707
            WHERE
                ("Healthcare Provider Primary Taxonomy Switch_1" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_1" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_2" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_2" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_3" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_3" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_4" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_4" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_5" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_5" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_6" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_6" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_7" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_7" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_8" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_8" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_9" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_9" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_10" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_10" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_11" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_11" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_12" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_12" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_13" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_13" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_14" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_14" IN ('207X00000X','207XS0114X'))
                OR ("Healthcare Provider Primary Taxonomy Switch_15" = 'Y'
                    AND "Healthcare Provider Taxonomy Code_15" IN ('207X00000X','207XS0114X'))
            GROUP BY 1) AS D
        ON A."ZIPCODE"=D.pvd_zip
    WHERE A."STATE" IN ('AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL',
                        'GA','HI','ID','IL','IN','IA','KS','KY','LA','ME',
                        'MD','MA','MI','MN','MS','MO','MT','NE','NV','NH',
                        'NJ','NM','NY','NC','ND','OH','OK','OR','PA','PR',
                        'RI','SC','SD','TN','TX','UT','VT','VA','WA','WV',
                        'WI','WY')) E
GROUP BY 1
ORDER BY 1;
`

const COLORECTAL_QUERY = `
SELECT
        "STATE_" AS state
        ,SUM(colorectal_surgeon_or_gastroenterologist) AS colorectal_surgeon_or_gastroenterologist
        ,SUM(colorectal_or_gastroenterology_organization) AS colorectal_or_gastroenterology_organization
        ,SUM(population) AS population
        ,SUM(housing_units) AS housing_units
        ,SUM(population_male) AS population_male
        ,SUM(population_female) AS population_female
        ,SUM(education_less_than_high_school) AS education_less_than_high_school
        ,SUM(education_high_school_graduate) AS education_high_school_graduate
        ,SUM(education_associate_degree) AS education_associate_degree
        ,SUM(education_bachelors_or_higher) AS education_bachelors_or_higher
        ,SUM(education_professional_school) AS education_professional_school
        ,SUM(household_income_below_25k) AS household_income_below_25k
        ,SUM(household_income_25k_to_45k) + SUM(household_income_45k_to_60k) AS household_income_25k_to_60k
        ,SUM(household_income_60k_to_100k) AS household_income_60k_to_100k
        ,SUM(household_income_100k_to_150k) + SUM(household_income_150k_to_200k) AS household_income_100k_to_200k
        ,SUM(household_income_above_200k) AS household_income_above_200k
        ,SUM(population_white) AS population_white
        ,SUM(population_black_african_american) AS population_black_african_american
        ,SUM(population_american_indian_alaska_native) AS population_american_indian_alaska_native
        ,SUM(population_asian) AS population_asian
        ,SUM(population_native_hawaiian_pacific_islander) AS population_native_hawaiian_pacific_islander
        ,SUM(population_other) AS population_other
        ,SUM(population_two_or_more_races) AS population_two_or_more_races
FROM
    (SELECT DISTINCT A."ZIP_CODE"
                    ,A."STATE_"
                    ,B.HSA
                    ,B.HSA_CITY
                    ,B.HSA_STATE
                    ,B.HRR
                    ,B.HRR_CITY
                    ,B.HRR_STATE
                    ,C.population
                    ,C.housing_units
                    ,C.population_male
                    ,C.population_female
                    ,C.education_less_than_high_school
                    ,C.education_high_school_graduate
                    ,C.education_associate_degree
                    ,C.education_bachelors_or_higher
                    ,C.education_professional_school
                    ,C.household_income_below_25k
                    ,C.household_income_25k_to_45k
                    ,C.household_income_45k_to_60k
                    ,C.household_income_60k_to_100k
                    ,C.household_income_100k_to_150k
                    ,C.household_income_150k_to_200k
                    ,C.household_income_above_200k
                    ,C.population_white
                    ,C.population_black_african_american
                    ,C.population_american_indian_alaska_native
                    ,C.population_asian
                    ,C.population_native_hawaiian_pacific_islander
                    ,C.population_other
                    ,C.population_two_or_more_races
                    ,D.colorectal_surgeon_or_gastroenterologist
                    ,D.colorectal_or_gastroenterology_organization
    FROM REF_GEOGRAPHY A
    LEFT JOIN REF_HSA_HRR B
        ON A."ZIP_CODE"=B.ZIP_CODE
    LEFT JOIN REF_CENSUS C
        ON A."ZIP_CODE"=C.zip_code
    LEFT JOIN
            (SELECT substr("PROVIDER_BUSINESS_PRACTICE_LOCATION_ADDRESS_POSTAL_CD",1,5) AS pvd_zip
                    ,SUM(CASE WHEN "ENTITY_TYPE_CD"=1 THEN 1 ELSE 0 END) AS colorectal_surgeon_or_gastroenterologist
                    ,SUM(CASE WHEN "ENTITY_TYPE_CD"=2 THEN 1 ELSE 0 END) AS colorectal_or_gastroenterology_organization
            FROM REF_NPPES
            WHERE
                ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_1" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_1" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_2" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_2" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_3" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_3" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_4" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_4" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_5" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_5" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_6" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_6" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_7" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_7" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_8" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_8" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_9" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_9" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_10" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_10" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_11" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_11" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_12" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_12" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_13" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_13" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_14" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_14" IN ('208C00000X', '207RG0100X'))
                OR ("HEALTHCARE_PROVIDER_PRIMARY_TAXONOMY_SWITCH_15" = 'Y'
                    AND "HEALTHCARE_PROVIDER_TAXONOMY_CD_15" IN ('208C00000X', '207RG0100X'))
            GROUP BY 1) AS D
        ON A."ZIP_CODE"=D.pvd_zip
    WHERE A."STATE_" IN ('AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL',
                        'GA','HI','ID','IL','IN','IA','KS','KY','LA','ME',
                        'MD','MA','MI','MN','MS','MO','MT','NE','NV','NH',
                        'NJ','NM','NY','NC','ND','OH','OK','OR','PA','PR',
                        'RI','SC','SD','TN','TX','UT','VT','VA','WA','WV',
                        'WI','WY')) E
GROUP BY 1
ORDER BY 1;
`;


const colo_data = [
  {
    "state": "AL",
    "colorectal_surgeon_or_gastroenterologist": "244",
    "colorectal_or_gastroenterology_organization": 77,
    "population": "4,760,671",
    "housing_units": "2,168,020",
    "population_male": "2,320,118",
    "population_female": "2,459,470",
    "education_less_than_high_school": "539,200",
    "education_high_school_graduate": "1,694,916",
    "education_associate_degree": "236,473"
  },
  {
    "state": "AR",
    "colorectal_surgeon_or_gastroenterologist": "126",
    "colorectal_or_gastroenterology_organization": 41,
    "population": "2,908,840",
    "housing_units": "1,314,697",
    "population_male": "1,431,688",
    "population_female": "1,484,354",
    "education_less_than_high_school": "315,076",
    "education_high_school_graduate": "1,113,059",
    "education_associate_degree": "119,051"
  },
  {
    "state": "AZ",
    "colorectal_surgeon_or_gastroenterologist": "394",
    "colorectal_or_gastroenterology_organization": 138,
    "population": "6,202,968",
    "housing_units": "2,774,353",
    "population_male": "3,096,290",
    "population_female": "3,130,466",
    "education_less_than_high_school": "596,062",
    "education_high_school_graduate": "2,080,305",
    "education_associate_degree": "340,045"
  },
  {
    "state": "CA",
    "colorectal_surgeon_or_gastroenterologist": "1,818",
    "colorectal_or_gastroenterology_organization": 639,
    "population": "30,467,033",
    "housing_units": "11,035,668",
    "population_male": "15,171,576",
    "population_female": "15,365,255",
    "education_less_than_high_school": "3,880,643",
    "education_high_school_graduate": "8,349,974",
    "education_associate_degree": "1,503,582"
  },
  {
    "state": "CO",
    "colorectal_surgeon_or_gastroenterologist": "334",
    "colorectal_or_gastroenterology_organization": 95,
    "population": "4,942,184",
    "housing_units": "2,186,452",
    "population_male": "2,486,221",
    "population_female": "2,475,618",
    "education_less_than_high_school": "332,020",
    "education_high_school_graduate": "1,509,894",
    "education_associate_degree": "273,646"
  },
  {
    "state": "CT",
    "colorectal_surgeon_or_gastroenterologist": "410",
    "colorectal_or_gastroenterology_organization": 153,
    "population": "3,565,287",
    "housing_units": "1,490,381",
    "population_male": "1,724,456",
    "population_female": "1,840,831",
    "education_less_than_high_school": "265,163",
    "education_high_school_graduate": "1,358,122",
    "education_associate_degree": "205,181"
  },
  {
    "state": "DE",
    "colorectal_surgeon_or_gastroenterologist": "80",
    "colorectal_or_gastroenterology_organization": 30,
    "population": "935,614",
    "housing_units": "433,762",
    "population_male": "456,539",
    "population_female": "479,075",
    "education_less_than_high_school": "76,839",
    "education_high_school_graduate": "347,249",
    "education_associate_degree": "48,017"
  },
  {
    "state": "FL",
    "colorectal_surgeon_or_gastroenterologist": "1,212",
    "colorectal_or_gastroenterology_organization": 479,
    "population": "20,278,447",
    "housing_units": "9,417,086",
    "population_male": "9,853,570",
    "population_female": "10,424,877",
    "education_less_than_high_school": "2,327,463",
    "education_high_school_graduate": "7,218,160",
    "education_associate_degree": "1,095,683"
  },
  {
    "state": "GA",
    "colorectal_surgeon_or_gastroenterologist": "564",
    "colorectal_or_gastroenterology_organization": 135,
    "population": "9,604,190",
    "housing_units": "4,067,910",
    "population_male": "4,718,412",
    "population_female": "4,946,125",
    "education_less_than_high_school": "961,809",
    "education_high_school_graduate": "3,143,217",
    "education_associate_degree": "437,796"
  },
  {
    "state": "IL",
    "colorectal_surgeon_or_gastroenterologist": "784",
    "colorectal_or_gastroenterology_organization": 295,
    "population": "12,812,508",
    "housing_units": "5,373,690",
    "population_male": "6,223,105",
    "population_female": "6,589,403",
    "education_less_than_high_school": "1,299,672",
    "education_high_school_graduate": "5,073,514",
    "education_associate_degree": "764,303"
  }
];

const joint_data = [
  {
    "state": "AL",
    "orthopaedic_surgeons": "337",
    "orthopaedic_surgeries": "195",
    "population": "4760671",
    "housing_units": "2168020",
    "population_male": "2320118",
    "population_female": "2459470",
    "education_less_than_high_school": "539200",
    "education_high_school_graduate": "1694916",
    "education_associate_degree": "28214",
    "population_american_indian_alaska_native": "28214",
    "population_asian": "53595",
    "population_native_hawaiian_pacific_islander": "3056",
    "population_other": "96910",
    "population_two_or_more_races": "71250"
  },
  {
    "state": "AR",
    "orthopaedic_surgeons": "209",
    "orthopaedic_surgeries": "100",
    "population": "2908840",
    "housing_units": "1314697",
    "population_male": "1431688",
    "population_female": "1484354",
    "education_less_than_high_school": "315076",
    "education_high_school_graduate": "1113059",
    "education_associate_degree": "22254",
    "population_american_indian_alaska_native": "22254",
    "population_asian": "36102",
    "population_native_hawaiian_pacific_islander": "5863",
    "population_other": "99579",
    "population_two_or_more_races": "57008"
  },
  {
    "state": "AZ",
    "orthopaedic_surgeons": "458",
    "orthopaedic_surgeries": "288",
    "population": "6202968",
    "housing_units": "2774353",
    "population_male": "3096290",
    "population_female": "3130466",
    "education_less_than_high_school": "596062",
    "education_high_school_graduate": "2080305",
    "education_associate_degree": "297162",
    "population_american_indian_alaska_native": "297162",
    "population_asian": "164200",
    "population_native_hawaiian_pacific_islander": "12341",
    "population_other": "750094",
    "population_two_or_more_races": "212235"
  },
  {
    "state": "CA",
    "orthopaedic_surgeons": "1917",
    "orthopaedic_surgeries": "1054",
    "population": "30467033",
    "housing_units": "11035668",
    "population_male": "15171576",
    "population_female": "15365255",
    "education_less_than_high_school": "3880643",
    "education_high_school_graduate": "8349974",
    "education_associate_degree": "266922",
    "population_american_indian_alaska_native": "266922",
    "population_asian": "4049597",
    "population_native_hawaiian_pacific_islander": "111482",
    "population_other": "5499185",
    "population_two_or_more_races": "1454659"
  },
  {
    "state": "CO",
    "orthopaedic_surgeons": "479",
    "orthopaedic_surgeries": "296",
    "population": "4942184",
    "housing_units": "2186452",
    "population_male": "2486221",
    "population_female": "2475618",
    "education_less_than_high_school": "332020",
    "education_high_school_graduate": "1509894",
    "education_associate_degree": "55689",
    "population_american_indian_alaska_native": "55689",
    "population_asian": "136795",
    "population_native_hawaiian_pacific_islander": "6408",
    "population_other": "362718",
    "population_two_or_more_races": "170237"
  },
  {
    "state": "CT",
    "orthopaedic_surgeons": "345",
    "orthopaedic_surgeries": "204",
    "population": "3562739",
    "housing_units": "1487227",
    "population_male": "1739614",
    "population_female": "1834483",
    "education_less_than_high_school": "264405",
    "education_high_school_graduate": "1109839",
    "education_associate_degree": "11256",
    "population_american_indian_alaska_native": "11256",
    "population_asian": "135565",
    "population_native_hawaiian_pacific_islander": "1428",
    "population_other": "198466",
    "population_two_or_more_races": "92676"
  },
  {
    "state": "DC",
    "orthopaedic_surgeons": "68",
    "orthopaedic_surgeries": "21",
    "population": "593412",
    "housing_units": "295698",
    "population_male": "284222",
    "population_female": "317501",
    "education_less_than_high_school": "49793",
    "education_high_school_graduate": "142273",
    "education_associate_degree": "2079",
    "population_american_indian_alaska_native": "2079",
    "population_asian": "21056",
    "population_native_hawaiian_pacific_islander": "302",
    "population_other": "24374",
    "population_two_or_more_races": "17316"
  },
  {
    "state": "DE",
    "orthopaedic_surgeons": "81",
    "orthopaedic_surgeries": "58",
    "population": "892194",
    "housing_units": "405831",
    "population_male": "434935",
    "population_female": "462990",
    "education_less_than_high_school": "74963",
    "education_high_school_graduate": "315784",
    "education_associate_degree": "4181",
    "population_american_indian_alaska_native": "4181",
    "population_asian": "28549",
    "population_native_hawaiian_pacific_islander": "400",
    "population_other": "30519",
    "population_two_or_more_races": "23854"
  },
  {
    "state": "FL",
    "orthopaedic_surgeons": "1489",
    "orthopaedic_surgeries": "938",
    "population": "18575247",
    "housing_units": "8908133",
    "population_male": "9099911",
    "population_female": "9516999",
    "education_less_than_high_school": "1837664",
    "education_high_school_graduate": "6671970",
    "education_associate_degree": "70874",
    "population_american_indian_alaska_native": "70874",
    "population_asian": "449455",
    "population_native_hawaiian_pacific_islander": "12121",
    "population_other": "672141",
    "population_two_or_more_races": "466409"
  },
  {
    "state": "GA",
    "orthopaedic_surgeons": "745",
    "orthopaedic_surgeries": "398",
    "population": "9604190",
    "housing_units": "4067910",
    "population_male": "4718412",
    "population_female": "4946125",
    "education_less_than_high_school": "961809",
    "education_high_school_graduate": "3143217",
    "education_associate_degree": "437796",
    "population_american_indian_alaska_native": "32076",
    "population_asian": "314318",
    "population_native_hawaiian_pacific_islander": "6800",
    "population_other": "388397",
    "population_two_or_more_races": "207219"
  }
];

const zipcodeMetadata = [
  {
    "label": "ZIP CODE",
    "core": true,
    "foreignKey": true,
    "primaryKey": true,
    "nullable": false,
    "format": "Length 5 all numeric",
    "description": "USPS ASSIGNED ZIP CODE",
    "uniqueValues": "40,000",
    "commonValues": "--",
    "nullPercentage": "0.000%",
    "min": "00501",
    "max": "95052",
    "average": "--"
  },
  {
    "label": "CITY",
    "core": true,
    "foreignKey": false,
    "primaryKey": false,
    "nullable": false,
    "format": "Text length 28",
    "description": "USPS ASSIGNED CITY NAME FOR A SPECIFIC ZIP CODE",
    "uniqueValues": "17,836",
    "commonValues": "WASHINGTON, HOUSTON, NEW YORK",
    "nullPercentage": "0.000%",
    "min": "--",
    "max": "--",
    "average": "--"
  },
  {
    "label": "STATE",
    "core": true,
    "foreignKey": true,
    "primaryKey": false,
    "nullable": false,
    "format": "Text length 2",
    "description": "USPS ASSIGNED STATE ABBREVIATION FOR A SPECIFIC ZIP CODE",
    "uniqueValues": "47",
    "commonValues": "TX, PA, NY",
    "nullPercentage": "0.000%",
    "min": "--",
    "max": "--",
    "average": "--"
  },
  // {
  //   "label": "COUNTY",
  //   "core": true,
  //   "foreignKey": true,
  //   "primaryKey": false,
  //   "nullable": false,
  //   "format": "Text length 21",
  //   "description": "USPS ASSIGNED COUNTY NAME FOR A SPECIFIC ZIP CODE",
  //   "uniqueValues": "1,756",
  //   "commonValues": "LOS ANGELES, JEFFERSON, WASHINGTON",
  //   "nullPercentage": "0.000%",
  //   "min": "--",
  //   "max": "--",
  //   "average": "--"
  // },
  // {
  //   "label": "AREA_CODE",
  //   "core": true,
  //   "foreignKey": false,
  //   "primaryKey": false,
  //   "nullable": true,
  //   "format": "--",
  //   "description": "PRIMARY NORTH AMERICAN NUMBERING PLAN ADMINISTRATOR (NANPA) AREA CODE ASSIGNED FOR A SPECIFIC ZIP CODE",
  //   "uniqueValues": "1",
  //   "commonValues": NaN,
  //   "nullPercentage": "100.00%",
  //   "min": "--",
  //   "max": "--",
  //   "average": "--"
  // },
  // {
  //   "label": "LATITUDE",
  //   "core": true,
  //   "foreignKey": false,
  //   "primaryKey": false,
  //   "nullable": true,
  //   "format": "Decimal XX.XXXXX",
  //   "description": "PRIMARY LATITUDE FOR A SPECIFIC ZIP CODE",
  //   "uniqueValues": "31,821",
  //   "commonValues": "33.786594, 29.83399, 38.893311",
  //   "nullPercentage": "0.030%",
  //   "min": "24.90169",
  //   "max": "59.58000",
  //   "average": "--"
  // },
  // {
  //   "label": "LONGITUDE",
  //   "core": true,
  //   "foreignKey": false,
  //   "primaryKey": false,
  //   "nullable": true,
  //   "format": "Decimal XX.XXXXX",
  //   "description": "PRIMARY LONGITUDE FOR A SPECIFIC ZIP CODE",
  //   "uniqueValues": "31,849",
  //   "commonValues": "-72.637078, -71.459405, -73.977182",
  //   "nullPercentage": "0.030%",
  //   "min": "-123.048629",
  //   "max": "111.96000",
  //   "average": "--"
  // },
  // {
  //   "label": "PASS INITIAL CLEANSE",
  //   "core": false,
  //   "foreignKey": false,
  //   "primaryKey": false,
  //   "nullable": false,
  //   "format": "Length 1 all numeric",
  //   "description": "FLAG THAT ENABLES USER TO FILTER OUT RECORDS THAT DO NOT PASS LIGHT CLEANSING",
  //   "uniqueValues": "2",
  //   "commonValues": "will calculate after create",
  //   "nullPercentage": "0.000%",
  //   "min": "0",
  //   "max": "1",
  //   "average": "--"
  // }
]

const dartMetadata = [
  {
    label: "ZIP CODE",
    core: true,
    foreignKey: true,
    primaryKey: true,
    nullable: false,
    format: "Length 5 all numeric",
    description: "USPS ASSIGNED ZIP CODE",
    uniqueValues: "40,866",
    commonValues: "--",
    nullPercentage: "0.000%",
    min: "00501",
    max: "99950",
    average: "--"
  },
  {
    label: "HSA CITY",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: false,
    format: "Text length 24",
    description: "HSA CITY NAME LABEL",
    uniqueValues: "2,690",
    commonValues: "WASHINGTON, SPRINGFIELD, HOUSTON",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  },
  {
    label: "HRR CITY",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: false,
    format: "Text length 24",
    description: "HRR CITY NAME LABEL",
    uniquevalues: "294",
    commonValues: "SPRINGFIELD, PITTSBURGH, PORTLAND",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  },
  {
    label: "HSA STATE",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: false,
    format: "Text length 2",
    description: "HSA STATE NAME LABEL",
    uniqueValues: "51",
    commonValues: "TX, CA, PA",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  },
  {
    label: "HRR STATE",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: false,
    format: "Text length 2",
    description: "HRR STATE NAME LABEL",
    uniqueValues: "51",
    commonValues: "TX, CA, PA",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  }
]

const nppesMetadata = [
  {
    label: "NPI",
    core: true,
    foreignKey: true,
    primaryKey: true,
    nullable: false,
    format: "Numeric",
    description: "UNIQUE PROVODER ID ASSIGNED BY NPPES FOR INDIVIDUALS AND ORGANIZATIONS",
    uniqueValues: "--",
    commonValues: "--",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  },
  {
    label: "ENTITY TYPE CODE",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: false,
    format: "Numeric",
    description: "",
    uniqueValues: "--",
    commonValues: "--",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  },
  {
    label: "PROVIDER FIRST LINE BUSINESS PRACTICE LOCATION ADDRESS",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: false,
    format: "Numeric",
    description: "",
    uniqueValues: "--",
    commonValues: "--",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  },
  {
    label: "PROVIDER SECOND LINE BUSINESS PRACTICE LOCATION ADDRESS",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: false,
    format: "Numeric",
    description: "",
    uniqueValues: "--",
    commonValues: "--",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  },
  {
    label: "PROVIDER BUSINESS PRACTICE LOCATION ADDRESS CITY NAME",
    core: false,
    foreignKey: false,
    primaryKey: false,
    nullable: true,
    format: "Numeric",
    description: "",
    uniqueValues: "--",
    commonValues: "--",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  },
  {
    label: "PROVIDER BUSINESS PRACTICE LOCATION ADDRESS STATE NAME",
    core: false,
    foreignKey: false,
    primaryKey: false,
    nullable: true,
    format: "Numeric",
    description: "",
    uniqueValues: "--",
    commonValues: "--",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  },
  {
    label: "PROVIDER BUSINESS PRACTICE LOCATION ADDRESS POSTAL CODE",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: false,
    format: "Numeric",
    description: "",
    uniqueValues: "--",
    commonValues: "--",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  },
  {
    label: "PROVIDER BUSINESS PRACTICE LOCATION ADDRESS COUNTRY CODE",
    core: false,
    foreignKey: false,
    primaryKey: false,
    nullable: true,
    format: "Numeric",
    description: "",
    uniqueValues: "--",
    commonValues: "--",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  },
  {
    label: "PROVIDER BUSINESS PRACTICE LOCATION ADDRESS TELEPHONE NUMBER",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: false,
    format: "Numeric",
    description: "",
    uniqueValues: "--",
    commonValues: "--",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  },
  {
    label: "PROVIDER BUSINESS PRACTICE LOCATION ADDRESS FAX NUMBER",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: false,
    format: "Numeric",
    description: "",
    uniqueValues: "--",
    commonValues: "--",
    nullPercentage: "0.000%",
    min: "--",
    max: "--",
    average: "--"
  }
];
const censusMetadata = [
  {
    label: "ZIP CODE",
    core: true,
    foreignKey: true,
    primaryKey: true,
    nullable: true,
    format: "Numeric",
    description: "USPS ASSIGNED ZIP CODE",
    uniqueValues: "40,000",
    commonValues: "--",
    nullPercentage: "0.000%",
    min: "00501",
    max: "96,754",
    average: "--"
  },
  {
    label: "POPULATION",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: true,
    format: "Numeric",
    description: "All people, male and female, child and adult, living in a given geographic area",
    uniqueValues: "14,859",
    commonValues: "--",
    nullPercentage: "24.580%",
    min: "9",
    max: "113,916",
    average: "16,903.30"
  },
  {
    label: "HOUSING UNITS",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: false,
    format: "Numeric",
    description: "A house, an apartment, a mobile home or trailer...",
    uniqueValues: "10,733",
    commonValues: "--",
    nullPercentage: "24.580%",
    min: "6",
    max: "47,617",
    average: "8,356.21"
  },
  {
    label: "MEDIAN HOUSEHOLD INCOME",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: false,
    format: "Numeric",
    description: "The sum of the income of all people 15 years and older...",
    uniqueValues: "19,075",
    commonValues: "--",
    nullPercentage: "24.580%",
    min: "2,499",
    max: "250,001",
    average: "55,028.25"
  },
  {
    label: "POPULATION DENSITY",
    core: true,
    foreignKey: false,
    primaryKey: false,
    nullable: false,
    format: "Numeric",
    description: "Total population within a geographic entity divided by the land area of that entity measured in square kilometers or square miles...",
    uniqueValues: "5,090",
    commonValues: "--",
    nullPercentage: "24.580%",
    min: "0",
    max: "143,683",
    average: "5,552.04"
  }
  // Additional rows follow the same pattern...
];

function MetadataVisualization({ data }) {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <Accordion type="single" collapsible className="w-full">
        {data.map((field, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{field.label}</span>
                <div className="flex space-x-1">
                  {field.core && <Badge variant="secondary">C</Badge>}
                  {field.foreignKey && <Badge variant="secondary">FK</Badge>}
                  {field.primaryKey && <Badge variant="secondary">PK</Badge>}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(field).map(([key, value]) => (
                  key !== 'label' && key !== 'notes' && (
                    <div key={key}>
                      <p className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</p>
                      <p>{typeof value === 'boolean' ? (value ? <Check className="text-green-500" /> : <X className="text-red-500" />) : value}</p>
                    </div>
                  )
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  )
}

function MetadataTable({ data }) {
  return (
    <ScrollArea className="h-[600px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
            <TableHead>Core</TableHead>
            <TableHead>Foreign Key</TableHead>
            <TableHead>Primary Key</TableHead>
            <TableHead>Nullable</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Number of Unique Values</TableHead>
            <TableHead>Most Common Values or Example</TableHead>
            <TableHead>% NULL</TableHead>
            <TableHead>Min</TableHead>
            <TableHead>Max</TableHead>
            <TableHead>Average</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((field, index) => (
            <TableRow key={index}>
              <TableCell>{field.label}</TableCell>
              <TableCell>{field.core ? 'Yes' : 'No'}</TableCell>
              <TableCell>{field.foreignKey ? 'Yes' : 'No'}</TableCell>
              <TableCell>{field.primaryKey ? 'Yes' : 'No'}</TableCell>
              <TableCell>{field.nullable ? 'Yes' : 'No'}</TableCell>
              <TableCell >{field.format}</TableCell>
              <TableCell style={{ width: '110%' }}>{field.description}</TableCell>
              <TableCell>{field.uniqueValues}</TableCell>
              <TableCell>{field.commonValues}</TableCell>
              <TableCell>{field.nullPercentage}</TableCell>
              <TableCell>{field.min}</TableCell>
              <TableCell>{field.max}</TableCell>
              <TableCell>{field.average}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

function NavButton({ icon: Icon, label, onClick, isActive }: { icon: React.ElementType, label: string, onClick: () => void, isActive?: boolean }) {
  return (
    <Button 
      variant={isActive ? "secondary" : "ghost"}
      size="sm" 
      className="w-full justify-start"
      onClick={onClick}
    >
      <Icon className="mr-1 h-3 w-3" /> {label}
    </Button>
  )
}

function AccordionSection({ title, icon: Icon, items, selectedFilters, setSelectedFilters }: { title: string, icon: React.ElementType, items: string[], selectedFilters: string[], setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>> }) {
  return (
    <AccordionItem value={title.toLowerCase()}>
      <AccordionTrigger>
        <div className="flex items-center">
          <Icon className="mr-2 h-4 w-4" />
          {title}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          <Label>Select {title}</Label>
          {items.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox 
                id={`${title.toLowerCase()}-${item.toLowerCase().replace(/\s+/g, '-')}`}
                checked={selectedFilters.includes(item)}
                onCheckedChange={(checked) => {
                  setSelectedFilters(prev => 
                    checked 
                      ? [...prev, item]
                      : prev.filter(i => i !== item)
                  )
                }}
              />
              <Label htmlFor={`${title.toLowerCase()}-${item.toLowerCase().replace(/\s+/g, '-')}`}>{item}</Label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function TableViewButton({ icon: Icon, label, isActive, onClick }: { icon: React.ElementType, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onClick}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}

function DataTable({ title, fields, data }: { title: string, fields: string[], data: string[][] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {fields.map((field, index) => (
                <TableHead key={index}>{field}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}


export default function Component() {
  const [isNavOpen, setIsNavOpen] = React.useState(true);
  const [activePane, setActivePane] = React.useState<
    "chat" | "build" | "explore"
  >("chat");
  const [isSecondPaneOpen, setIsSecondPaneOpen] = React.useState(true);
  const [chatMessages, setChatMessages] = React.useState([
    {
      role: "system",
      content: "How can I assist you with your data analysis today?",
    },
  ]);
  const [sqlQuery, setSqlQuery] = React.useState("");
  const [activeTableView, setActiveTableView] = React.useState<
    "table" | "records" | "metadata" | "lineage"
  >("table");
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [showTableView, setShowTableView] = React.useState(false)
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>(['Reference', 'Geography'])
  const [metadataView, setMetadataView] = React.useState<'table' | 'visualization'>('table')
  const [selectedDartmouthFields, setSelectedDartmouthFields] = React.useState<string[]>(['ZIP_CODE', 'HSA CITY', 'HSA STATE', 'HRR CITY', 'HRR STATE'])
  const [selectedCensusFields, setSelectedCensusFields] = React.useState<string[]>(['ZIP CODE', 'HOUSING UNITS', 'MEDIAN HOUSEHOLD INCOME', 'POPULATION DENSITY', 'POPULATION'])
  const [selectedZipCodeFields, setSelectedZipCodeFields] = React.useState<string[]>(['ZIPCODE', 'CITY', 'STATE'])
  const [queryType, setQueryType] = React.useState<"colo" | "joint" | "">("");

  const [selectedNPPESFields, setSelectedNPPESFields] = React.useState<string[]>([
    'ENTITY TYPE CODE',
    'PROVIDER BUSINESS PRACTICE LOCATION ADDRESS POSTAL CODE',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 1',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 2',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 3',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 4',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 5',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 6',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 7',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 8',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 9',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 10',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 11',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 12',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 13',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 14',
    'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 15',
    'HEALTHCARE PROVIDER TAXONOMY CODE 1',
    'HEALTHCARE PROVIDER TAXONOMY CODE 2',
    'HEALTHCARE PROVIDER TAXONOMY CODE 3',
    'HEALTHCARE PROVIDER TAXONOMY CODE 4',
    'HEALTHCARE PROVIDER TAXONOMY CODE 5',
    'HEALTHCARE PROVIDER TAXONOMY CODE 6',
    'HEALTHCARE PROVIDER TAXONOMY CODE 7',
    'HEALTHCARE PROVIDER TAXONOMY CODE 8',
    'HEALTHCARE PROVIDER TAXONOMY CODE 9',
    'HEALTHCARE PROVIDER TAXONOMY CODE 10',
    'HEALTHCARE PROVIDER TAXONOMY CODE 11',
    'HEALTHCARE PROVIDER TAXONOMY CODE 12',
    'HEALTHCARE PROVIDER TAXONOMY CODE 13',
    'HEALTHCARE PROVIDER TAXONOMY CODE 14',
    'HEALTHCARE PROVIDER TAXONOMY CODE 15'
  ])

  const fetchSQLResults = async (query: string) => {
    console.log("Fetching SQL results:", query);
    const useLocalDB = process.env.NEXT_PUBLIC_USE_LOCAL_DB === 'true';
    const BASE_URL = useLocalDB ? process.env.NEXT_PUBLIC_LOCAL_BASE_URL : process.env.NEXT_PUBLIC_AZURE_BASE_URL;  
    try {
      const response = await fetch(
        `${BASE_URL}api/sl_execute_sql`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }
      );
      const data = await response.json();
      console.log("SQL results:", data.results);
      setTableData(data.results);
    } catch (error) {
      console.error("Error fetching SQL results:", error);
    }
  };

  interface DataSourceProps {
    title: string;
    source: string;
    date: string;
  }
  const DataSource: React.FC<DataSourceProps> = ({ title, source, date }) => (
    <Card className="w-full max-w-[300px] bg-primary text-primary-foreground">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">- {source}</p>
        <p className="text-sm">- {date}</p>
      </CardContent>
    </Card>
  );
  interface ProcessedDataProps {
    title: string;
    description: string;
    date: string;
  }
  const ProcessedData: React.FC<ProcessedDataProps> = ({
    title,
    description,
    date,
  }) => (
    <Card className="w-full max-w-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">- {description}</p>
        <p className="text-sm">- {date}</p>
      </CardContent>
    </Card>
  );

  const coloTableData = [
    { state_code: 'Colonoscopy', total: 1500, averageAge: 55.3 },
    { state_code: 'FIT', total: 2000, averageAge: 52.7 },
    { state_code: 'Sigmoidoscopy', total: 800, averageAge: 58.1 },
  ];

  const jointTableData = [
    { method: 'Hips', total: 1500, averageAge: 55.3 },
    { method: 'Knuckles', total: 2000, averageAge: 52.7 },
    { method: 'Knees', total: 800, averageAge: 58.1 },
  ];

  const [checkboxes, setCheckboxes] = React.useState({
    "condition-diabetes": false,
    "condition-hypertension": false,
    "condition-asthma": false,
    "condition-copd": false,
    "condition-joint replacement": false,
    "condition-colonoscopy": false,
  });
  
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('checkbox change triggered');
    const { id, checked } = event.target;
    console.log(`Checkbox ${id} is now ${checked ? 'checked' : 'unchecked'}`);
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [id]: checked,
    }));
  };
    // const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { id, checked } = event.target;
  //   console.log(`Checkbox ${id} is now ${checked ? 'checked' : 'unchecked'}`);
  //   if (checked) {
  //     if (id === "condition-colonoscopy") {
  //       setQueryType("colo");
  //     } else if (id === "condition-joint replacement") {
  //       setQueryType("joint");
  //     }
  //   } else {
  //     setQueryType("");
  //   }
  //   console.log(`query type is now ${queryType}`);
  // };

  const handleApplyBuildFilters = () => {
    console.log("Apply Filters clicked");
    console.log("Checkbox states:", checkboxes);
  
    // Example logic to update queryType based on checkboxes
    if (checkboxes["condition-colonoscopy"]) {
      setQueryType("colo");
      setSqlQuery(COLORECTAL_QUERY);
      setTableData(coloTableData);
    } else if (checkboxes["condition-joint replacement"]) {
      setQueryType("joint");
      setSqlQuery(JOINT_REPLACEMENT_QUERY);
      setTableData(jointTableData);
    } else {
      setQueryType("");
      setTableData([]);
    }

    setShowTableView(true);
  }
  // const handleApplyBuildFilters = () => {
  //   setShowTableView(true);
  //   // setQueryType('colo')
  //   if (queryType === "colo") {
  //     setSqlQuery(COLORECTAL_QUERY)
  //     setTableData(coloTableData);
  //   } else if (queryType === "joint") {
  //     setSqlQuery(JOINT_REPLACEMENT_QUERY)
  //     setTableData(jointTableData);
  //   } else {
  //     setTableData([]);
  //   }

  // }

  const handleSendMessage = (event) => {
    event.preventDefault();
    const userInput = event.target.userInput.value;

    const newMessage = { role: 'user', content: userInput };
    const updatedMessages = [...chatMessages, newMessage];
    //setChatMessages([...chatMessages, newMessage]);

    if (userInput.includes('colo')) {
      setSqlQuery(COLORECTAL_QUERY);
      updatedMessages.push({ role: 'system', content: 'I have processed this question about colorectal patients. Please see the query I generated to the right.' });
      setTableData(coloTableData)
      setQueryType('colo');
    } else if (userInput.includes('joint')) {
      setSqlQuery(JOINT_REPLACEMENT_QUERY);
      updatedMessages.push({ role: 'system', content: 'I have processed this question about joint replacement patients. Please see the query I generated to the right.' });
      setTableData(jointTableData)
      setQueryType('joint');
    } else {
      setSqlQuery('');
      setChatMessages([...chatMessages, newMessage, { role: 'system', content: 'Please better specify the question' }]);
      setQueryType('');
    }
    setChatMessages(updatedMessages);
    event.target.userInput.value = '';
  };

  // const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Input element:", sqlQuery); // Debug log
  //   if (sqlQuery && sqlQuery.trim()) {
  //     const newMessage = { role: "user", content: sqlQuery };
  //     setChatMessages([...chatMessages, newMessage]);
  //     fetchSQLResults(sqlQuery);
  //     setTimeout(() => {
  //       setChatMessages((prev) => [
  //         ...prev,
  //         {
  //           role: "system",
  //           content:
  //             "Based on your question, here's a SQL query that might help:",
  //         },
  //       ]);
  //       //setSqlQuery("SELECT * FROM REF_HSA_HRR limit 10;");
  //     }, 1000);
  //   } else {
  //     console.error("Input element is empty or not found.");
  //   }
  // };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleExport = () => {
    // This is a dummy function. In a real application, this would trigger the file download.
    console.log('Exporting all data')
    // You would typically call an API or generate files here
  }

  const handleApplyFilters = () => {
    // Your existing filter logic
    setShowTableView(true);
  };

  const handleRunQuery = () => {
    // Hard-coded table data
    const hardCodedTableData = [
      { id: 1, name: 'John Doe', age: 30, city: 'New York' },
      { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
      { id: 3, name: 'Sam Johnson', age: 35, city: 'Chicago' },
    ];
  
    // Set the table data and show the table view
    setTableData(hardCodedTableData);
    setShowTableView(true);
    setActivePane('chat'); // Ensure the active pane is set to 'explore'
  };

  const navItems = [
    { icon: MessageSquare, label: 'Chat' },
    { icon: Cpu, label: 'Build' },
    { icon: Compass, label: 'Explore' },
  ]

  const accordionItems = [
    { title: 'Source', icon: Database, items: ['CMS', 'CDC', 'Dartmouth Atlas', 'NIH', 'NUCC', 'US Census Bureau', 'US Postal Service'] },
    { title: 'Category', icon: FolderOpen, items: ['Compare', 'Payer', 'Provider', 'Reference'] },
    { title: 'Entity', icon: Box, items: ['Condition', 'Cost', 'Facility', 'Geography', 'Group', 'Provider (Individual)', 'Provider (Organization)', 'Setting', 'Speciality', 'Utilization'] },
  ]

  const tableViewButtons = [
    { icon: TableIcon, label: 'Show Table', view: 'table' },
    { icon: FileText, label: 'View Records', view: 'records' },
    { icon: Database, label: 'Show Metadata', view: 'metadata' },
    { icon: Network, label: 'Show Lineage', view: 'lineage' },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Left Navigation */}
      <nav
        className={`${
          isNavOpen ? "w-44" : "w-12"
        } border-r transition-all duration-300 ease-in-out flex flex-col ${
          isFullScreen ? "hidden" : ""
        }`}
      >
        <div className="p-2 flex items-center justify-between">
          {isNavOpen && <h2 className="text-lg font-bold">SemantIQ</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="h-6 w-6"
            aria-label={isNavOpen ? "Collapse navigation" : "Expand navigation"}
          >
            {isNavOpen ? (
              <ChevronLeft className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        </div>
        {isNavOpen ? (
          <div className="flex-1 overflow-auto p-2">
            <ul className="space-y-1">
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setActivePane("chat")}
                >
                  <MessageSquare className="mr-1 h-3 w-3" /> Chat
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setActivePane("build")}
                >
                  <Cpu className="mr-1 h-3 w-3" /> Build
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setActivePane("explore")}
                >
                  <Compass className="mr-1 h-3 w-3" /> Explore
                </Button>
              </li>
            </ul>
            <Button size="sm" className="w-full mt-2">
              <Plus className="mr-1 h-3 w-3" /> New Project
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center pt-2 space-y-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              aria-label="Chat"
              onClick={() => setActivePane("chat")}
            >
              <MessageSquare className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              aria-label="Build"
              onClick={() => setActivePane("build")}
            >
              <Cpu className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              aria-label="Explore"
              onClick={() => setActivePane("explore")}
            >
              <Compass className="h-3 w-3" />
            </Button>
          </div>
        )}
        {/* Profile Button */}
        <div className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">shadcn</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    m@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Second Pane (Chat, Build, or Explore) */}
      <aside
        className={`${
          isSecondPaneOpen ? "w-80" : "w-16"
        } border-r transition-all duration-300 ease-in-out flex flex-col ${
          isFullScreen ? "hidden" : ""
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSecondPaneOpen && (
            <h2 className="text-xl font-semibold">
              {activePane === "chat"
                ? "Copilot"
                : activePane === "build"
                ? "Filters"
                : "Explore"}
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSecondPaneOpen(!isSecondPaneOpen)}
            className="h-8 w-8"
            aria-label={isSecondPaneOpen ? "Collapse pane" : "Expand pane"}
          >
            {isSecondPaneOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
        {isSecondPaneOpen &&
          (activePane === "chat" ? (
            <>
              <ScrollArea className="flex-1 px-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-2 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="p-4">
                <Input
                  id="userInput"
                  name="userInput"
                  placeholder="Type your message..."
                  className="mb-2"
                />
                <Button type="submit" className="w-full">
                  Send
                </Button>
              </form>
            </>
          ) : activePane === "build" ? (
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="temporal">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Temporal
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="time-basis">Select Time Basis</Label>
                          <Select>
                            <SelectTrigger id="time-basis">
                              <SelectValue placeholder="Select time basis" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="paid">Paid Date</SelectItem>
                              <SelectItem value="service">
                                Service Date
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time-period">
                            Select Time Period
                          </Label>
                          <Select>
                            <SelectTrigger id="time-period">
                              <SelectValue placeholder="Select time period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">
                                Quarterly
                              </SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="geographical">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        Geographical
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="geography-basis">
                            Select Geography Basis
                          </Label>
                          <Select>
                            <SelectTrigger id="geography-basis">
                              <SelectValue placeholder="Select geography basis" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="provider">Provider</SelectItem>
                              <SelectItem value="individual">
                                Individual
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="geography-level">
                            Select Geography Level
                          </Label>
                          <Select>
                            <SelectTrigger id="geography-level">
                              <SelectValue placeholder="Select geography level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="zipcode">ZipCode</SelectItem>
                              <SelectItem value="county">County</SelectItem>
                              <SelectItem value="hsa">HSA</SelectItem>
                              <SelectItem value="hrr">HRR</SelectItem>
                              <SelectItem value="msa">MSA</SelectItem>
                              <SelectItem value="state">State</SelectItem>
                              <SelectItem value="country">Country</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="activities">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Activity className="mr-2 h-4 w-4" />
                        Activities
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <Label>Select Activities</Label>
                        {[
                          "Screenings",
                          "Procedures",
                          "Medications",
                          "Lab Tests",
                        ].map((activity) => (
                          <div
                            key={activity}
                            className="flex items-center  space-x-2"
                          >
                            <Checkbox
                              id={`activity-${activity.toLowerCase()}`}
                            />
                            <Label
                              htmlFor={`activity-${activity.toLowerCase()}`}
                            >
                              {activity}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="unit-of-measure">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Unit of Measure
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <Label htmlFor="unit-of-measure">
                          Select Unit of Measure
                        </Label>
                        <Select>
                          <SelectTrigger id="unit-of-measure">
                            <SelectValue placeholder="Select unit of measure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="count">Count</SelectItem>
                            <SelectItem value="percentage">
                              Percentage
                            </SelectItem>
                            <SelectItem value="rate">Rate per 1000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="conditions">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Stethoscope className="mr-2 h-4 w-4" />
                        Conditions
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <Label>Select Conditions</Label>
                        {["Diabetes", "Hypertension", "Asthma", "COPD", "Joint Replacement", "Colonoscopy"].map(
                          (condition) => (
                            <div
                              key={condition}
                              className="flex items-center space-x-2"
                            >
                              <CustomCheckbox
                                id={`condition-${condition.toLowerCase()}`}
                                onChange={handleCheckboxChange}
                              />
                              <Label
                                htmlFor={`condition-${condition.toLowerCase()}`}
                              >
                                {condition}
                              </Label>
                            </div>
                          )
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="cohort">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Cohort
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <Label htmlFor="cohort">Select Cohort</Label>
                        <Select>
                          <SelectTrigger id="cohort">
                            <SelectValue placeholder="Select cohort" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all-patients">
                              All Patients
                            </SelectItem>
                            <SelectItem value="pediatric">Pediatric</SelectItem>
                            <SelectItem value="adult">Adult</SelectItem>
                            <SelectItem value="geriatric">Geriatric</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="specialty-taxonomy">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Specialty Taxonomy
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <Label>Select Specialties</Label>
                        {[
                          "Primary Care",
                          "Cardiology",
                          "Oncology",
                          "Neurology",
                        ].map((specialty) => (
                          <div
                            key={specialty}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`specialty-${specialty
                                .toLowerCase()
                                .replace(" ", "-")}`}
                            />
                            <Label
                              htmlFor={`specialty-${specialty
                                .toLowerCase()
                                .replace(" ", "-")}`}
                            >
                              {specialty}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="provider">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        Provider
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <Label htmlFor="provider">Select Provider</Label>
                        <Select>
                          <SelectTrigger id="provider">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Providers</SelectItem>
                            <SelectItem value="provider-1">1871585885</SelectItem>
                            <SelectItem value="provider-2">1821080896</SelectItem>
                            <SelectItem value="provider-3">1528050721</SelectItem>
                            <SelectItem value="provider-4">1609868801</SelectItem>
                            <SelectItem value="provider-5">1821080946</SelectItem>
                            <SelectItem value="provider-6">1639161755</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="setting">
                    <AccordionTrigger>
                      <div className="flex items-center">
                        <Hospital className="mr-2 h-4 w-4" />
                        Setting
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <Label>Select Settings</Label>
                        {[
                          "Inpatient",
                          "Outpatient",
                          "Emergency",
                          "Ambulatory",
                        ].map((setting) => (
                          <div
                            key={setting}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox id={`setting-${setting.toLowerCase()}`} />
                            <Label htmlFor={`setting-${setting.toLowerCase()}`}>
                              {setting}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Button className="w-full mt-4" onClick={handleApplyBuildFilters}>
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </ScrollArea>
          ) : ( 
            //we are in explore mode now
            <ScrollArea className="flex-1">
              <div className="p-4">
              <div className="p-4 space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {accordionItems.map((item) => (
                      <AccordionSection key={item.title} title={item.title} icon={item.icon} items={item.items} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
                    ))}
                  </Accordion>
                  <Button className="w-full mt-4" onClick={handleApplyFilters}>
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                  </Button>
                </div>
          </div>
            </ScrollArea>
          ))}
      </aside>

      {/* Main Content Area (Right Pane) */}
      <main
        className={`flex-1 p-6 overflow-auto ${
          isFullScreen ? "fixed inset-0 z-50 bg-background" : ""
        }`}
      >
        {activePane !== "explore" ? (
          <Tabs defaultValue="query">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="query">Query</TabsTrigger>
              <TabsTrigger value="tableView">Table View</TabsTrigger>
            </TabsList>
            <TabsContent value="query">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>SQL Query</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <BookOpen className="h-5 w-5" />
                              <span className="sr-only">
                                Open data dictionary
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] max-h-[600px] overflow-y-auto">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">
                                  Data Dictionary
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Explanation of the data elements in your
                                  query.
                                </p>
                              </div>
                              <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <span className="text-sm font-medium">
                                    screening_method
                                  </span>
                                  <span className="col-span-2 text-sm">
                                    The type of colorectal cancer screening
                                    performed
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <span className="text-sm font-medium">
                                    total_screenings
                                  </span>
                                  <span className="col-span-2 text-sm">
                                    The count of screenings for each method
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <span className="text-sm font-medium">
                                    avg_age
                                  </span>
                                  <span className="col-span-2 text-sm">
                                    The average age of patients for each
                                    screening method
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <span className="text-sm font-medium">
                                    screening_date
                                  </span>
                                  <span className="col-span-2 text-sm">
                                    The date when the screening was performed
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                  <span className="text-sm font-medium">
                                    patient_age
                                  </span>
                                  <span className="col-span-2 text-sm">
                                    The age of the patient at the time of
                                    screening
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">
                                  Additional Information
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  The colorectal_screenings table contains
                                  information about various screening methods
                                  used for colorectal cancer detection. It
                                  includes data on the type of screening, when
                                  it was performed, and demographic information
                                  about the patients.
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open Data Dictionary</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendMessage}>
                    <Textarea
                      value={sqlQuery}
                      onChange={(e) => setSqlQuery(e.target.value)}
                      placeholder="Your SQL query will appear here..."
                      className="min-h-[200px] font-mono"
                    />
                    {/* <Button type="submit" >Run Query</Button> */}
                  </form>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      <strong>Query Explanation</strong>
                    </h4>
                    {queryType === 'colo' ? (
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Step 1: Select the Data</strong>
                            <p>The outer SELECT statement specifies the columns to retrieve:</p>
                            <ul className="list-disc pl-5">
                                <li>"STATE": The state code.</li>
                                <li>Various <code>SUM()</code> functions to aggregate counts of healthcare providers and demographic data (population, housing units, education levels, income brackets, and racial/ethnic groups).</li>
                            </ul>
                        </li>

                        <li>
                            <strong>Step 2: From Clause and Subquery</strong>
                            <p>The data is pulled from a subquery labeled E, which combines information from multiple tables:</p>
                            <ul className="list-disc pl-5">
                                <li><strong>Base Table:</strong> zipcodes A - This is the main table containing ZIP code and state data.</li>
                                <li><strong>Joining Other Tables:</strong></li>
                                <ul className="list-disc pl-5">
                                    <li>LEFT JOIN with <code>zip_crosswalks_ziphsahrr19</code> B: Links ZIP codes to healthcare service areas (HSAs) and health resource regions (HRRs).</li>
                                    <li>LEFT JOIN with <code>zip_to_census</code> C: Joins census data based on ZIP codes to get demographic information.</li>
                                    <li>LEFT JOIN with a subquery D: This subquery calculates the number of colorectal surgeons and gastroenterology organizations by ZIP code from a dataset of healthcare providers (<code>nppes_npidata_pfile_2005052320240707</code>).</li>
                                </ul>
                            </ul>
                        </li>

                        <li>
                            <strong>Step 3: Subquery for Healthcare Providers</strong>
                            <p>In the subquery D, the query:</p>
                            <ul className="list-disc pl-5">
                                <li>Uses <code>SUM()</code> with CASE statements to count colorectal surgeons and gastroenterology organizations based on specific taxonomy codes.</li>
                                <li>Groups the results by ZIP code.</li>
                            </ul>
                        </li>

                        <li>
                            <strong>Step 4: Filtering Data</strong>
                            <p>The <code>WHERE</code> clause filters results to include only specific states, ensuring that only data from the listed states is processed.</p>
                        </li>

                        <li>
                            <strong>Step 5: Aggregating Results</strong>
                            <p>The outer query groups the results by state (<code>GROUP BY 1</code>), which refers to the first column in the SELECT statement (the state code). It sums various metrics across all relevant ZIP codes for each state.</p>
                        </li>

                        <li>
                            <strong>Step 6: Ordering Results</strong>
                            <p>Finally, the <code>ORDER BY 1</code> clause sorts the results by state in ascending order.</p>
                        </li>

                        <li>
                            <strong>Summary of the Result</strong>
                            <p>The final output provides a summary of the number of colorectal surgeons, gastroenterologists, demographic details, and socioeconomic factors for each state specified in the query. This aggregated data can be used for analyzing healthcare access and demographic trends across states.</p>
                        </li>
                        </ol>
                    ) : queryType === 'joint' ? (
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>
                          <strong>Step 1: Select the Data</strong>
                          <p>The outer SELECT statement specifies the columns to retrieve:</p>
                          <ul className="list-disc pl-5">
                              <li>"STATE": The state code, aliased as <code>state</code>.</li>
                              <li>Various <code>SUM()</code> functions that aggregate counts of orthopaedic surgeons, orthopaedic surgeries, and demographic data (population, housing units, education levels, income brackets, and racial/ethnic groups).</li>
                          </ul>
                      </li>

                      <li>
                          <strong>Step 2: From Clause and Subquery</strong>
                          <p>The data is pulled from a subquery labeled E, which combines information from multiple tables:</p>
                          <ul className="list-disc pl-5">
                              <li><strong>Base Table:</strong> <code>zipcodes</code> A - This table contains ZIP code and state information.</li>
                              <li><strong>Joining Other Tables:</strong></li>
                              <ul className="list-disc pl-5">
                                  <li>LEFT JOIN with <code>zip_crosswalks_ziphsahrr19</code> B: Links ZIP codes to healthcare service areas (HSAs) and health resource regions (HRRs).</li>
                                  <li>LEFT JOIN with <code>zip_to_census</code> C: Joins demographic data based on ZIP codes.</li>
                                  <li>LEFT JOIN with a subquery D: This subquery counts orthopaedic surgeons and surgeries based on a dataset of healthcare providers (<code>nppes_npidata_pfile_2005052320240707</code>).</li>
                              </ul>
                          </ul>
                      </li>

                      <li>
                          <strong>Step 3: Subquery for Healthcare Providers</strong>
                          <p>In subquery D, the query:</p>
                          <ul className="list-disc pl-5">
                              <li>Uses <code>SUM()</code> with CASE statements to count orthopaedic surgeons and orthopaedic surgeries based on specific taxonomy codes.</li>
                              <li>The <code>WHERE</code> clause filters the data for only those providers marked as active (using the Primary Taxonomy Switch).</li>
                              <li>The results are grouped by the first five digits of the ZIP code (<code>pvd_zip</code>).</li>
                          </ul>
                      </li>

                      <li>
                          <strong>Step 4: Filtering Data</strong>
                          <p>The <code>WHERE</code> clause in the subquery filters results to include only specific states, ensuring that only data from those states is processed.</p>
                      </li>

                      <li>
                          <strong>Step 5: Aggregating Results</strong>
                          <p>The outer query groups the results by state (<code>GROUP BY 1</code>), which refers to the first column in the SELECT statement (the state code). It sums various metrics across all relevant ZIP codes for each state.</p>
                      </li>

                      <li>
                          <strong>Step 6: Ordering Results</strong>
                          <p>Finally, the <code>ORDER BY 1</code> clause sorts the results by state in ascending order.</p>
                      </li>

                      <li>
                          <strong>Summary of the Result</strong>
                          <p>The final output provides a summary of the number of orthopaedic surgeons, orthopaedic surgeries, and demographic details for each specified state. This aggregated data can be used to analyze healthcare access and demographic trends related to orthopaedic care across states.</p>
                      </li> 
                      </ol>
                    ) : (
                      <p className="text-sm text-muted-foreground">No query explanation available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              {(activePane === "chat" || activePane === "build") && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Related Studies</CardTitle>
                  </CardHeader>
                  {queryType === 'colo' ? (
                  <CardContent>
                    <p className="mb-4">
                      <a
                        href="https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2815644"
                        className="text-blue-500 hover:underline ml-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        JAMA: Effectiveness of Colonoscopy Screening vs Sigmoidoscopy Screening in Colorectal Cancer
                      </a>
                    </p>
                    <ul style={{ paddingLeft: '20px' }}>
                     <li/>This comparative effectiveness simulation study of 358204 adults showed a statistically significant 7 percentage point reduction in colorectal cancer incidence and mortality at 15-year follow-up of colonoscopy screening, which proportionally amounted to 30% benefit compared with sigmoidoscopy screening.
                    </ul>
                    <br />
                    <p className="mb-4">
                      <a
                        href="https://www.nejm.org/doi/full/10.1056/NEJMoa2208375#:~:text=In%20a%20pooled%20analysis%20of,who%20had%20not%20been%20invited.&text=Colonoscopy%20is%20considered%20to%20be,examine%20the%20entire%20large%20bowel.&text=Thus%2C%20sigmoidoscopy%20has%20largely%20been,be%20performed%20every%2010%20years.&text=In%20contrast%2C%20colonoscopy%20has%20not,of%20this%20test%20is%20lacking.&text=A%20balance%20among%20benefits%2C%20harms,related%20death%20at%2010%20years"
                        className="text-blue-500 hover:underline ml-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Effect of Colonoscopy Screening on Risks of Colorectal Cancer and Related Death
                        </a>
                    </p>
                    <ul style={{ paddingLeft: '20px' }}>
                      <li><strong>Study Design:</strong> A randomized controlled trial involving individuals aged 55 to 64, comparing those who underwent colonoscopy screening with a control group.</li>
                      <li><strong>Colorectal Cancer Incidence:</strong> The study found a significant reduction in colorectal cancer incidence among participants who received screening compared to the control group.</li>
                      <li><strong>Mortality Rates:</strong> There was a notable decrease in colorectal cancer-related deaths in the screening group, indicating that colonoscopy effectively reduces both cancer risk and mortality.</li>
                      <li><strong>Long-term Effects:</strong> The benefits of screening persisted over a substantial follow-up period, underscoring the importance of regular colonoscopy screening in this age group.</li>
                      <li><strong>Safety and Adherence:</strong> The procedure was generally safe, with low rates of complications, and adherence to screening recommendations was emphasized as critical for maximizing benefits.</li>
</ul>



                  </CardContent>
                  ) :  queryType === 'joint' ? ( 
                    <CardContent>
                    <p className="mb-4">
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4551172/#:~:text=Prevalence%20increased%20with%20age%2C%20and,the%20U.S.%20population%20in%202010" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-2">
                        <h2>NIH: Prevalence of Total Hip and Knee Replacement in the United States</h2>
                      </a>
                      </p>
                      <ul style={{ paddingLeft: '20px' }}>
                        <li>The prevalence of total hip and total knee replacement in the total U.S. population was <strong>0.83%</strong> and <strong>1.52%</strong>, respectively.</li>
                        <li>Prevalence was higher among women than among men and increased with age.</li>
                        <li>These estimates corresponded to <strong>2.5 million individuals</strong> (1.4 million women and 1.1 million men) with total hip replacement and <strong>4.7 million individuals</strong> (3.0 million women and 1.7 million men) with total knee replacement.</li>
                        <li>Secular trends indicated a substantial rise in prevalence over time and a shift to younger ages.</li>
                      </ul>
                    <br />
                    <p className="mb-4">
                      <a href="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(18)32531-5/fulltext" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-2">
                        <h2>Lancet: How long does a knee replacement last?</h2>
                      </a>
                      </p>
                      <ul style={{ paddingLeft: '20px' }}>
                      <li>The aim of knee replacement surgery is the long-term relief of pain and restoration of function.</li>
                      <li>Unfortunately, knee replacements fail for a variety of reasons, including loosening, infection, persistent pain, and instability, and might require revision within the lifetime of the recipient.</li>
                      <li>Our pooled registry data, which we believe to be more accurate than the case series data, shows that approximately <strong>82%</strong> of TKRs last 25 years and <strong>70%</strong> of UKRs last 25 years.</li>
                    </ul>
                  </CardContent>
                  ) : (
                    <CardContent>
                      <h3 className="text-lg font-semibold mb-2">
                        No Related Studies Found
                      </h3>
                      <p>
                        There are no related studies available based on the
                        current query and filters applied.
                      </p>
                    </CardContent>
                  )}
                
                </Card>
              )}
            </TabsContent>
            <TabsContent value="tableView">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Table View
                    <TooltipProvider>
                      <div className="flex space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                activeTableView === "table"
                                  ? "secondary"
                                  : "ghost"
                              }
                              size="sm"
                              onClick={() => setActiveTableView("table")}
                              aria-label="Show table"
                            >
                              <TableIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Show Table</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                activeTableView === "records"
                                  ? "secondary"
                                  : "ghost"
                              }
                              size="sm"
                              onClick={() => setActiveTableView("records")}
                              aria-label="Show records"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Records</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                activeTableView === "metadata"
                                  ? "secondary"
                                  : "ghost"
                              }
                              size="sm"
                              onClick={() => setActiveTableView("metadata")}
                              aria-label="Show metadata"
                            >
                              <Database className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Show Metadata</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                activeTableView === "lineage"
                                  ? "secondary"
                                  : "ghost"
                              }
                              size="sm"
                              onClick={() => setActiveTableView("lineage")}
                              aria-label="Show lineage"
                            >
                              <GitBranch className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Show Lineage</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={toggleFullScreen}
                              aria-label={
                                isFullScreen
                                  ? "Exit full screen"
                                  : "Enter full screen"
                              }
                            >
                              {isFullScreen ? (
                                <Minimize2 className="h-4 w-4" />
                              ) : (
                                <Maximize2 className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {isFullScreen
                                ? "Exit Full Screen"
                                : "Enter Full Screen"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeTableView === "table" && (
                      <ScrollArea className="h-[600px]">
                      <div className="space-y-6">

                      <Card>
                          <CardHeader>
                            <CardTitle>NPPES</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              {['NPI',
'ENTITY TYPE CODE',
'EMPLOYER IDENTIFICATION NUMBER',
'PROVIDER ORGANIZATION NAME',
'PROVIDER LAST NAME',
'PROVIDER FIRST NAME',
'PROVIDER CREDENTIAL',
'PROVIDER OTHER ORGANIZATION NAME',
'PROVIDER OTHER ORGANIZATION NAME TYPE CODE',
'PROVIDER OTHER LAST NAME',
'PROVIDER OTHER FIRST NAME',
'PROVIDER OTHER CREDENTIAL',
'PROVIDER FIRST LINE BUSINESS PRACTICE LOCATION ADDRESS',
'PROVIDER SECOND LINE BUSINESS PRACTICE LOCATION ADDRESS',
'PROVIDER BUSINESS PRACTICE LOCATION ADDRESS POSTAL CODE',
'PROVIDER BUSINESS PRACTICE LOCATION ADDRESS TELEPHONE NUMBER',
'PROVIDER BUSINESS PRACTICE LOCATION ADDRESS FAX NUMBER',
'PROVIDER ENUMERATION DATE',
'NPI DEACTIVATION REASON CODE',
'NPI DEACTIVATION DATE',
'NPI REACTIVATION DATE',
'PROVIDER GENDER CODE',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 1',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 2',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 2',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 3',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 3',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 4',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 5',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 6',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 7',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 8',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 9',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 10',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 11',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 12',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 13',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 14',
'HEALTHCARE PROVIDER PRIMARY TAXONOMY SWITCH 15',
'HEALTHCARE PROVIDER TAXONOMY CODE 1',
'HEALTHCARE PROVIDER TAXONOMY CODE 2',
'HEALTHCARE PROVIDER TAXONOMY CODE 3',
'HEALTHCARE PROVIDER TAXONOMY CODE 4',
'HEALTHCARE PROVIDER TAXONOMY CODE 5',
'HEALTHCARE PROVIDER TAXONOMY CODE 6',
'HEALTHCARE PROVIDER TAXONOMY CODE 7',
'HEALTHCARE PROVIDER TAXONOMY CODE 8',
'HEALTHCARE PROVIDER TAXONOMY CODE 9',
'HEALTHCARE PROVIDER TAXONOMY CODE 10',
'HEALTHCARE PROVIDER TAXONOMY CODE 11',
'HEALTHCARE PROVIDER TAXONOMY CODE 12',
'HEALTHCARE PROVIDER TAXONOMY CODE 13',
'HEALTHCARE PROVIDER TAXONOMY CODE 14',
'HEALTHCARE PROVIDER TAXONOMY CODE 15',
'SOLE PROPRIETOR',
'PROVIDER TAXONOMY GROUP 1',
'PROVIDER TAXONOMY GROUP 2',
'PROVIDER TAXONOMY GROUP 3',
'PROVIDER TAXONOMY GROUP 4',
'PROVIDER TAXONOMY GROUP 5'].map((field) => (
                                <div key={field} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`nppes-${field.toLowerCase().replace(/\s+/g, '-')}`}
                                    checked={selectedNPPESFields.includes(field)}
                                    onCheckedChange={(checked) => {
                                      setSelectedNPPESFields(prev => checked
                                        ? [...prev, field]
                                        : prev.filter(f => f !== field)
                                      );
                                    } } />
                                  <Label htmlFor={`nppes-${field.toLowerCase().replace(/\s+/g, '-')}`}>{field}</Label>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Dartmouth HSA HRR</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              {['ZIP_CODE', 'HRR', 'HRR CITY', 'HRR STATE', 'HSA', 'HSA CITY', 'HSA STATE'].map((field) => (
                                <div key={field} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`dartmouth-${field.toLowerCase().replace(/\s+/g, '-')}`}
                                    checked={selectedDartmouthFields.includes(field)}
                                    onCheckedChange={(checked) => {
                                      setSelectedDartmouthFields(prev => checked
                                        ? [...prev, field]
                                        : prev.filter(f => f !== field)
                                      );
                                    } } />
                                  <Label htmlFor={`dartmouth-${field.toLowerCase().replace(/\s+/g, '-')}`}>{field}</Label>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Census</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              {[
                                'ZIP CODE', 'POPULATION', 'HOUSING UNITS', 'MEDIAN HOME VALUE', 'MEDIAN HOUSEHOLD INCOME',
                                'OCCUPIED HOUSING UNITS', 'POPULATION DENSITY', 'ZIP CODE TYPE', 'EDUCATION LESS THAN HIGH SCHOOL',
                                'EDUCATION HIGH SCHOOL GRADUATE', 'EDUCATION ASSOCIATE DEGREE', 'EDUCATION BACHELORS OR HIGHER',
                                'EDUCATION MASTERS OR HIGHER', 'EDUCATION PROFESSIONAL SCHOOL', 'EDUCATION DOCTORATE DEGREE',
                                'POPULATION MALE', 'POPULATION FEMALE', 'POPULATION WHITE', 'POPULATION BLACK AFRICAN AMERICAN',
                                'POPULATION AMERICAN INDIAN ALASKA NATIVE', 'POPULATION ASIAN', 'POPULATION NATIVE HAWAIIAN PACIFIC ISLANDER',
                                'POPULATION OTHER', 'POPULATION TWO OR MORE RACES'
                              ].map((field) => (
                                <div key={field} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`census-${field.toLowerCase().replace(/\s+/g, '-')}`}
                                    checked={selectedCensusFields.includes(field)}
                                    onCheckedChange={(checked) => {
                                      setSelectedCensusFields(prev => checked
                                        ? [...prev, field]
                                        : prev.filter(f => f !== field)
                                      );
                                    } } />
                                  <Label htmlFor={`census-${field.toLowerCase().replace(/\s+/g, '-')}`}>{field}</Label>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                              <CardTitle>ZipCode</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                {['ZIPCODE', 'CITY', 'STATE', 'COUNTY', 'AREA_CODE', 'LATITUDE', 'LONGITUDE'].map((field) => (
                                  <div key={field} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`zipcode-${field.toLowerCase().replace(/\s+/g, '-')}`}
                                      checked={selectedZipCodeFields.includes(field)}
                                      onCheckedChange={(checked) => {
                                        setSelectedZipCodeFields(prev =>
                                          checked
                                            ? [...prev, field]
                                            : prev.filter(f => f !== field)
                                        )
                                      }}
                                    />
                                    <Label htmlFor={`zipcode-${field.toLowerCase().replace(/\s+/g, '-')}`}>{field}</Label>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                      </div>
                    </ScrollArea>
                    
                  )}
                  {activeTableView === "records" && (
                    <div>
                      {queryType === 'colo' ? (
                        <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>State</TableHead>
                            <TableHead>colorectal_surgeon_or_gastroenterologist</TableHead>
                            <TableHead>colorectal_or_gastroenterology_organization</TableHead>
                            <TableHead>population</TableHead>
                            <TableHead>housing_units</TableHead>
                            <TableHead>population_male</TableHead>
                            <TableHead>population_female</TableHead>
                            <TableHead>education_less_than_high_school</TableHead>
                            <TableHead>education_high_school_graduate</TableHead>
                            <TableHead>education_associate_degree</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {colo_data.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.state}</TableCell>
                              <TableCell>{row.colorectal_surgeon_or_gastroenterologist}</TableCell>
                              <TableCell>{row.colorectal_or_gastroenterology_organization}</TableCell>
                              <TableCell>{row.population}</TableCell>
                              <TableCell>{row.housing_units}</TableCell>
                              <TableCell>{row.population_male}</TableCell>
                              <TableCell>{row.population_female}</TableCell>
                              <TableCell>{row.education_less_than_high_school}</TableCell>
                              <TableCell>{row.education_high_school_graduate}</TableCell>
                              <TableCell>{row.education_associate_degree}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : queryType === 'joint' ? (
                      <Table>
                      <TableHeader>
                        <TableRow>
                        <TableHead>state</TableHead>
                          <TableHead>orthopaedic_surgeons</TableHead>
                          <TableHead>orthopaedic_surgeries</TableHead>
                          <TableHead>population</TableHead>
                          <TableHead>housing_units</TableHead>
                          <TableHead>population_male</TableHead>
                          <TableHead>population_female</TableHead>
                          <TableHead>education_less_than_high_school</TableHead>
                          <TableHead>education_high_school_graduate</TableHead>
                          <TableHead>education_associate_degree</TableHead>
                          <TableHead>population_american_indian_alaska_native</TableHead>
                          <TableHead>population_asian</TableHead>
                          <TableHead>population_native_hawaiian_pacific_islander</TableHead>
                          <TableHead>population_other</TableHead>
                          <TableHead>population_two_or_more_races</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {joint_data.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.state}</TableCell>
                            <TableCell>{row.orthopaedic_surgeons}</TableCell>
                            <TableCell>{row.orthopaedic_surgeries}</TableCell>
                            <TableCell>{row.population}</TableCell>
                            <TableCell>{row.housing_units}</TableCell>
                            <TableCell>{row.population_male}</TableCell>
                            <TableCell>{row.population_female}</TableCell>
                            <TableCell>{row.education_less_than_high_school}</TableCell>
                            <TableCell>{row.education_high_school_graduate}</TableCell>
                            <TableCell>{row.education_associate_degree}</TableCell>
                            <TableCell>{row.population_american_indian_alaska_native}</TableCell>
                            <TableCell>{row.population_asian}</TableCell>
                            <TableCell>{row.population_native_hawaiian_pacific_islander}</TableCell>
                            <TableCell>{row.population_other}</TableCell>
                            <TableCell>{row.population_two_or_more_races}</TableCell>                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p>No data available</p>
                  )}

                    </div>
                  )}
                  {activeTableView === "metadata" && (
                    // build chat metadata
                    <>
                      <div className="overflow-y-scroll h-[500px]">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              NPPES
                              <Select value={metadataView} onValueChange={(value: 'table' | 'visualization') => setMetadataView(value)}>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select view" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="table">Table View</SelectItem>
                                  <SelectItem value="visualization">Visualization</SelectItem>
                                </SelectContent>
                              </Select>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {metadataView === 'table' ? <MetadataTable data={nppesMetadata}/> : <MetadataVisualization data={nppesMetadata}/>}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              Dartmouth HSA HRR
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {metadataView === 'table' ? <MetadataTable data={dartMetadata}/> : <MetadataVisualization data={dartMetadata}/>}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              Census
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {metadataView === 'table' ? <MetadataTable data={censusMetadata}/> : <MetadataVisualization data={censusMetadata}/>}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              Zip Codes
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {metadataView === 'table' ? <MetadataTable data={zipcodeMetadata}/> : <MetadataVisualization data={zipcodeMetadata}/>}
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                  {activeTableView === "lineage" && (
                    <div className="flex flex-col items-center space-y-4 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-4xl">
                        <DataSource
                          title="npidata_pfile_20050523-20240908"
                          source="Centers for Medicare & Medicaid Services (CMS)"
                          date="2024-09-24 date of record"
                        />
                        <DataSource
                          title="ziphsahrr19"
                          source="Dartmouth Atlas Project"
                          date="2019-09-01 date of record"
                        />
                        <DataSource
                          title="census_to_zip_2020"
                          source="United States Census Bureau"
                          date="2019-08-30 date of record"
                        />
                        <DataSource
                          title="geography_2024Q3"
                          source="United States Postal Service"
                          date="2019-09-30 date of record"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-4xl">
                        <ArrowDown className="mx-auto text-primary" size={24} />
                        <ArrowDown className="mx-auto text-primary" size={24} />
                        <ArrowDown className="mx-auto text-primary" size={24} />
                        <ArrowDown className="mx-auto text-primary" size={24} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-4xl">
                        <ProcessedData
                          title="NPPES"
                          description="SemantIQ data model and cleanselite"
                          date="2024-09-14 date of creation"
                        />
                        <ProcessedData
                          title="DARTMOUTH HSA HRR"
                          description="SemantIQ data model and cleanselite"
                          date="2024-09-14 date of creation"
                        />
                        <ProcessedData
                          title="CENSUS"
                          description="SemantIQ data model and cleanselite"
                          date="2024-09-14 date of creation"
                        />
                        <ProcessedData
                          title="GEOGRAPHY"
                          description="SemantIQ data model and cleanselite"
                          date="2024-10-01 date of creation"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-4xl">
                        <ArrowDown className="mx-auto text-primary" size={24} />
                        <ArrowDown className="mx-auto text-primary" size={24} />
                        <ArrowDown className="mx-auto text-primary" size={24} />
                        <ArrowDown className="mx-auto text-primary" size={24} />
                      </div>
                      <div className="flex justify-center w-full max-w-4xl">
                      <Card className="w-full max-w-[900px] bg-secondary">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-center">
                            Analytics File
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue="tableView">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="tableView">Table View</TabsTrigger>
            </TabsList> 
            <TabsContent value="tableView"> 
              {showTableView ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {activeTableView === 'table' && 'Table View'}
                      {activeTableView === 'records' && 'Sample Records'}
                      {activeTableView === 'metadata' && 'Metadata'}
                      {activeTableView === 'lineage' && 'Data Lineage'}
                      <TooltipProvider>
                        <div className="flex space-x-2">
                          {tableViewButtons.map((button) => (
                            <TableViewButton
                              key={button.view}
                              icon={button.icon}
                              label={button.label}
                              isActive={activeTableView === button.view}
                              onClick={() => setActiveTableView(button.view as 'table' | 'records' | 'metadata' | 'lineage')}
                            />
                          ))}
                          <Button variant="outline" size="sm" onClick={handleExport}>
                            <DownloadCloud className="mr-2 h-4 w-4" />
                            Export
                          </Button>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleFullScreen}
                                aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
                              >
                                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeTableView === 'table' && (
                      <ScrollArea className="h-[600px]">
                        <div className="space-y-6">
                          <Card>
                            <CardHeader>
                              <CardTitle>Dartmouth HSA HRR</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                {['ZIP_CODE', 'HRR', 'HRR CITY', 'HRR STATE', 'HSA', 'HSA CITY', 'HSA STATE'].map((field) => (
                                  <div key={field} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`dartmouth-${field.toLowerCase().replace(/\s+/g, '-')}`}
                                      checked={selectedDartmouthFields.includes(field)}
                                      onCheckedChange={(checked) => {
                                        setSelectedDartmouthFields(prev =>
                                          checked
                                            ? [...prev, field]
                                            : prev.filter(f => f !== field)
                                        )
                                      }}
                                    />
                                    <Label htmlFor={`dartmouth-${field.toLowerCase().replace(/\s+/g, '-')}`}>{field}</Label>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle>Census</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                {[
                                  'ZIP CODE', 'POPULATION', 'HOUSING UNITS', 'MEDIAN HOME VALUE', 'MEDIAN HOUSEHOLD INCOME',
                                  'OCCUPIED HOUSING UNITS', 'POPULATION DENSITY', 'ZIP CODE TYPE', 'EDUCATION LESS THAN HIGH SCHOOL',
                                  'EDUCATION HIGH SCHOOL GRADUATE', 'EDUCATION ASSOCIATE DEGREE', 'EDUCATION BACHELORS OR HIGHER',
                                  'EDUCATION MASTERS OR HIGHER', 'EDUCATION PROFESSIONAL SCHOOL', 'EDUCATION DOCTORATE DEGREE',
                                  'POPULATION MALE', 'POPULATION FEMALE', 'POPULATION WHITE', 'POPULATION BLACK AFRICAN AMERICAN',
                                  'POPULATION AMERICAN INDIAN ALASKA NATIVE', 'POPULATION ASIAN', 'POPULATION NATIVE HAWAIIAN PACIFIC ISLANDER',
                                  'POPULATION OTHER', 'POPULATION TWO OR MORE RACES'
                                ].map((field) => (
                                  <div key={field} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`census-${field.toLowerCase().replace(/\s+/g, '-')}`}
                                      checked={selectedCensusFields.includes(field)}
                                      onCheckedChange={(checked) => {
                                        setSelectedCensusFields(prev =>
                                          checked
                                            ? [...prev, field]
                                            : prev.filter(f => f !== field)
                                        )
                                      }}
                                    />
                                    <Label htmlFor={`census-${field.toLowerCase().replace(/\s+/g, '-')}`}>{field}</Label>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle>ZipCode</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                {['ZIPCODE', 'CITY', 'STATE', 'COUNTY', 'AREA_CODE', 'LATITUDE', 'LONGITUDE'].map((field) => (
                                  <div key={field} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`zipcode-${field.toLowerCase().replace(/\s+/g, '-')}`}
                                      checked={selectedZipCodeFields.includes(field)}
                                      onCheckedChange={(checked) => {
                                        setSelectedZipCodeFields(prev =>
                                          checked
                                            ? [...prev, field]
                                            : prev.filter(f => f !== field)
                                        )
                                      }}
                                    />
                                    <Label htmlFor={`zipcode-${field.toLowerCase().replace(/\s+/g, '-')}`}>{field}</Label>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </ScrollArea>
                    )}
                    {activeTableView === 'records' && (
                      <ScrollArea className="h-[600px]">
                        <div className="space-y-6">
                          <DataTable 
                            title="Dartmouth HSA HRR"
                            fields={['ZIP CODE', 'HSA', 'HSA CITY', 'HSA STATE']}
                            data={[
                              ['01001', '22058', 'Springfield', 'MA'],
                              ['01002', '22046', 'Northampton', 'MA'],
                              ['01003', '22046', 'Northampton', 'MA'],
                              ['01004', '22046', 'Northampton', 'MA'],
                              ['01005', '22070', 'Worcester', 'MA']
                            ]}
                          />

                          <DataTable 
                            title="Census"
                            fields={['ZIP CODE', 'POPULATION', 'HOUSING UNITS', 'MEDIAN HOME VALUE', 'MEDIAN HOUSEHOLD INCOME', 'OCCUPIED HOUSING UNITS', 'POPULATION DENSITY']}
                            data={[
                              ['01001', '16769', '7557', '213000', '58733', '7215', '1466'],
                              ['01002', '29049', '10388', '338900', '54422', '9910', '528'],
                              ['01005', '5079', '2044', '208500', '68644', '1904', '115'],
                              ['01007', '14649', '5839', '260000', '71875', '5595', '278'],
                              ['01008', '1263', '586', '247200', '71635', '503', '23']
                            ]}
                          />

                          <Card>
                            <CardHeader>
                              <CardTitle>ZipCode</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>ZIP CODE</TableHead>
                                    <TableHead>CITY</TableHead>
                                    <TableHead>STATE</TableHead>
                                    <TableHead>COUNTY</TableHead>
                                    <TableHead>LATITUDE</TableHead>
                                    <TableHead>LONGITUDE</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>01001</TableCell>
                                    <TableCell>Agawam</TableCell>
                                    <TableCell>MA</TableCell>
                                    <TableCell>HAMPDEN</TableCell>
                                    <TableCell>42.140549</TableCell>
                                    <TableCell>-72.788661</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>01002</TableCell>
                                    <TableCell>Amherst</TableCell>
                                    <TableCell>MA</TableCell>
                                    <TableCell>HAMPSHIRE</TableCell>
                                    <TableCell>42.367092</TableCell>
                                    <TableCell>-72.464571</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>01003</TableCell>
                                    <TableCell>Amherst</TableCell>
                                    <TableCell>MA</TableCell>
                                    <TableCell>HAMPSHIRE</TableCell>
                                    <TableCell>42.369562</TableCell>
                                    <TableCell>-72.63599</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>01004</TableCell>
                                    <TableCell>Amherst</TableCell>
                                    <TableCell>MA</TableCell>
                                    <TableCell>HAMPSHIRE</TableCell>
                                    <TableCell>42.384494</TableCell>
                                    <TableCell>-72.513183</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>01005</TableCell>
                                    <TableCell>Barre</TableCell>
                                    <TableCell>MA</TableCell>
                                    <TableCell>WORCESTER</TableCell>
                                    <TableCell>42.32916</TableCell>
                                    <TableCell>-72.139465</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        </div>
                      </ScrollArea>
                    )}
                    {activeTableView === 'metadata' && (
                      // explore metadata
                      <>
                      <div className="overflow-y-scroll h-[500px]">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              Zip Codes
                              <Select value={metadataView} onValueChange={(value: 'table' | 'visualization') => setMetadataView(value)}>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select view" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="table">Table View</SelectItem>
                                  <SelectItem value="visualization">Visualization</SelectItem>
                                </SelectContent>
                              </Select>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {metadataView === 'table' ? <MetadataTable data={zipcodeMetadata}/> : <MetadataVisualization data={zipcodeMetadata}/>}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              Dartmouth HSA HRR
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {metadataView === 'table' ? <MetadataTable data={dartMetadata}/> : <MetadataVisualization data={dartMetadata}/>}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              Census
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {metadataView === 'table' ? <MetadataTable data={censusMetadata}/> : <MetadataVisualization data={censusMetadata}/>}
                          </CardContent>
                        </Card>
                      </div>
                    </>
                    )}
                    {activeTableView === 'lineage' && (
                      <Card>
                        <CardContent>
                        <div className="flex flex-col items-center space-y-4 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                        <DataSource
                          title="zipcodes_2024Q3"
                          source="United States Postal Service"
                          date="20240930 date of record"
                        />
                        <DataSource
                          title="ziphsahrr19"
                          source="Dartmouth Atlas"
                          date="20190901 date of record"
                        />
                        <DataSource
                          title="ziptocensus2020"
                          source="Dartmouth Atlas"
                          date="20190901 date of record"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                        <ArrowDown className="mx-auto text-primary" size={24} />
                        <ArrowDown className="mx-auto text-primary" size={24} />
                        <ArrowDown className="mx-auto text-primary" size={24} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                        <ProcessedData
                          title="Geography"
                          description="SemantIQ data model and cleanselite"
                          date="20241005 date of creation"
                        />
                        <ProcessedData
                          title="Dartmouth Atlas"
                          description="SemantIQ data model and cleanselite"
                          date="20241003 date of creation"
                        />
                        <ProcessedData
                          title="Census 2020"
                          description="SemantIQ data model and cleanselite"
                          date="20241006 date of creation"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                        <ArrowDown className="mx-auto text-primary" size={24} />
                        <ArrowDown className="mx-auto text-primary" size={24} />
                        <ArrowDown className="mx-auto text-primary" size={24} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                        <Card className="w-full max-w-[300px] bg-secondary">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              Geography Extract
                            </CardTitle>
                          </CardHeader>
                        </Card>
                        <Card className="w-full max-w-[300px] bg-secondary">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              HSA HRR Extract
                            </CardTitle>
                          </CardHeader>
                        </Card>
                        <Card className="w-full max-w-[300px] bg-secondary">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              Census Extract
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      </div>
                    </div>
</CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-[600px]">
                  <p className="text-muted-foreground">Apply filters to view data</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )
        }
      </main>
    </div>
  );
}

